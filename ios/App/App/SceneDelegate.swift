import UIKit
import WebKit
import AVFoundation
import MediaPlayer
import Capacitor

class GeoBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        GeoAudioController.shared.attach(webView: self.webView)
    }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = GeoBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

final class GeoAudioController: NSObject, WKScriptMessageHandler {
    static let shared = GeoAudioController()

    private weak var webView: WKWebView?
    private var player: AVPlayer?
    private var timeObserver: Any?
    private var endObserver: NSObjectProtocol?
    private var interruptObserver: NSObjectProtocol?
    private var commandsRegistered = false

    private var queue: [[String: Any]] = []
    private var currentIndex: Int = -1
    private var shuffleOn: Bool = false
    private var repeatMode: String = "off"
    private var scClientId: String = "39AVoiZVrdvJEMFLH8T0c5WGshQaAPRJ"
    private var playbackRate: Float = 1.0

    private var curTrackId: String = ""
    private var curTitle: String = "Geo Music"
    private var curArtist: String = "Geo Music Player"
    private var curCover: String = ""
    private var curDurationSec: Double = 0
    private var curArtwork: MPMediaItemArtwork?
    private var isPlayingNow: Bool = false
    private var wasInterruptedWhilePlaying: Bool = false

    private override init() {
        super.init()
        setupRemoteCommands()
        setupInterruptionObserver()
    }

    func attach(webView: WKWebView?) {
        guard let wv = webView else { return }
        self.webView = wv
        wv.configuration.userContentController.removeScriptMessageHandler(forName: "geoAudio")
        wv.configuration.userContentController.add(self, name: "geoAudio")
    }

    private func offlineFolderURL() -> URL {
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let dir = docs.appendingPathComponent("GeoOffline", isDirectory: true)
        if !FileManager.default.fileExists(atPath: dir.path) {
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        }
        return dir
    }

    private func sanitizeId(_ raw: String) -> String {
        let allowed = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: "_-"))
        return raw.unicodeScalars.map { allowed.contains($0) ? Character($0) : "_" }.map { String($0) }.joined()
    }

    private func offlineFileURL(for trackId: String) -> URL? {
        let base = offlineFolderURL()
        let safe = sanitizeId(trackId)
        for ext in ["m4a", "mp3", "wav", "aac"] {
            let candidate = base.appendingPathComponent("\(safe).\(ext)")
            if FileManager.default.fileExists(atPath: candidate.path) {
                return candidate
            }
        }
        return nil
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let cmd = dict["cmd"] as? String else { return }

        switch cmd {
        case "setQueue":
            if let q = dict["queue"] as? [[String: Any]] {
                self.queue = q
            }
            if let idx = dict["currentIndex"] as? Int {
                self.currentIndex = idx
            }
            if let shuf = dict["shuffle"] as? Bool {
                self.shuffleOn = shuf
            }
            if let rep = dict["repeatMode"] as? String {
                self.repeatMode = rep
            }
            if let cid = dict["clientId"] as? String, !cid.isEmpty {
                self.scClientId = cid
            }

        case "playTrack":
            let id = (dict["id"] as? String) ?? ""
            let title = (dict["title"] as? String) ?? "Geo Music"
            let artist = (dict["artist"] as? String) ?? "Geo Music Player"
            let cover = (dict["cover"] as? String) ?? ""
            let streamUrl = (dict["streamUrl"] as? String) ?? ""
            let transcodingUrl = (dict["transcodingUrl"] as? String) ?? ""
            let durMs = (dict["durationMs"] as? Double) ?? 0
            let rate = (dict["rate"] as? Double) ?? Double(self.playbackRate)
            let autoPlay = (dict["autoPlay"] as? Bool) ?? true

            if let idx = dict["currentIndex"] as? Int { self.currentIndex = idx }
            if let shuf = dict["shuffle"] as? Bool { self.shuffleOn = shuf }
            if let rep = dict["repeatMode"] as? String { self.repeatMode = rep }
            if let cid = dict["clientId"] as? String, !cid.isEmpty { self.scClientId = cid }
            if let q = dict["queue"] as? [[String: Any]] { self.queue = q }

            self.playbackRate = Float(max(0.5, min(1.5, rate)))
            playTrackNative(
                id: id,
                title: title,
                artist: artist,
                cover: cover,
                streamUrl: streamUrl,
                transcodingUrl: transcodingUrl,
                durationSec: durMs / 1000.0,
                autoPlay: autoPlay
            )

        case "pause":
            pauseNative()

        case "resume":
            resumeNative()

        case "seek":
            if let posSec = dict["positionSec"] as? Double {
                seekNative(to: posSec)
            }

        case "setRate":
            if let r = dict["rate"] as? Double {
                self.playbackRate = Float(max(0.5, min(1.5, r)))
                if isPlayingNow {
                    player?.rate = self.playbackRate
                }
                updateNowPlayingInfo()
            }

        case "setRepeatShuffle":
            if let shuf = dict["shuffle"] as? Bool { self.shuffleOn = shuf }
            if let rep = dict["repeatMode"] as? String { self.repeatMode = rep }

        case "saveOfflineFile":
            if let id = dict["id"] as? String,
               let b64 = dict["base64"] as? String,
               let data = Data(base64Encoded: b64) {
                let ext = (dict["ext"] as? String) ?? "m4a"
                let safe = sanitizeId(id)
                let target = offlineFolderURL().appendingPathComponent("\(safe).\(ext)")
                DispatchQueue.global(qos: .utility).async {
                    try? data.write(to: target, options: .atomic)
                }
            }

        case "deleteOfflineFile":
            if let id = dict["id"] as? String {
                let base = offlineFolderURL()
                let safe = sanitizeId(id)
                for ext in ["m4a", "mp3", "wav", "aac"] {
                    let target = base.appendingPathComponent("\(safe).\(ext)")
                    try? FileManager.default.removeItem(at: target)
                }
            }

        case "clearOfflineFiles":
            let base = offlineFolderURL()
            if let files = try? FileManager.default.contentsOfDirectory(at: base, includingPropertiesForKeys: nil) {
                for f in files {
                    try? FileManager.default.removeItem(at: f)
                }
            }

        default:
            break
        }
    }

    private func activateAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default)
            try session.setActive(true)
        } catch {}
    }

    private func playTrackNative(
        id: String,
        title: String,
        artist: String,
        cover: String,
        streamUrl: String,
        transcodingUrl: String,
        durationSec: Double,
        autoPlay: Bool
    ) {
        self.curTrackId = id
        self.curTitle = title
        self.curArtist = artist
        self.curDurationSec = max(0, durationSec)

        if cover != self.curCover {
            self.curCover = cover
            self.curArtwork = nil
            loadArtwork(from: cover)
        }

        if let localURL = offlineFileURL(for: id) {
            startAVPlayer(with: localURL, autoPlay: autoPlay)
            return
        }

        if !streamUrl.isEmpty, let url = URL(string: streamUrl) {
            startAVPlayer(with: url, autoPlay: autoPlay)
            return
        }

        if !transcodingUrl.isEmpty {
            resolveSoundCloudStream(transcodingUrl: transcodingUrl) { [weak self] resolvedURL in
                guard let self = self, self.curTrackId == id, let url = resolvedURL else { return }
                self.startAVPlayer(with: url, autoPlay: autoPlay)
            }
        }
    }

    private func startAVPlayer(with url: URL, autoPlay: Bool) {
        DispatchQueue.main.async {
            self.activateAudioSession()
            self.cleanupPlayerObservers()

            let asset = AVURLAsset(url: url)
            let item = AVPlayerItem(asset: asset)

            if self.player == nil {
                self.player = AVPlayer(playerItem: item)
                self.player?.automaticallyWaitsToMinimizeStalling = true
            } else {
                self.player?.replaceCurrentItem(with: item)
            }

            self.endObserver = NotificationCenter.default.addObserver(
                forName: .AVPlayerItemDidPlayToEndTime,
                object: item,
                queue: .main
            ) { [weak self] _ in
                self?.handleTrackEnded()
            }

            let interval = CMTime(seconds: 0.5, preferredTimescale: 600)
            self.timeObserver = self.player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
                guard let self = self else { return }
                let cur = time.seconds.isFinite ? time.seconds : 0
                if let itemDur = self.player?.currentItem?.duration.seconds, itemDur.isFinite, itemDur > 0 {
                    self.curDurationSec = itemDur
                }
                self.notifyWebProgress(curSec: cur, durSec: self.curDurationSec, isPlaying: self.isPlayingNow)
            }

            if autoPlay {
                self.isPlayingNow = true
                self.player?.play()
                if self.playbackRate != 1.0 {
                    self.player?.rate = self.playbackRate
                }
            } else {
                self.isPlayingNow = false
                self.player?.pause()
            }

            self.updateNowPlayingInfo()
            self.notifyWebProgress(curSec: 0, durSec: self.curDurationSec, isPlaying: self.isPlayingNow)
        }
    }

    private func cleanupPlayerObservers() {
        if let obs = timeObserver {
            player?.removeTimeObserver(obs)
            timeObserver = nil
        }
        if let endObs = endObserver {
            NotificationCenter.default.removeObserver(endObs)
            endObserver = nil
        }
    }

    private func pauseNative() {
        DispatchQueue.main.async {
            self.isPlayingNow = false
            self.player?.pause()
            self.updateNowPlayingInfo()
            let cur = self.player?.currentTime().seconds ?? 0
            self.notifyWebProgress(curSec: cur.isFinite ? cur : 0, durSec: self.curDurationSec, isPlaying: false)
        }
    }

    private func resumeNative() {
        DispatchQueue.main.async {
            self.activateAudioSession()
            self.isPlayingNow = true
            self.player?.play()
            if self.playbackRate != 1.0 {
                self.player?.rate = self.playbackRate
            }
            self.updateNowPlayingInfo()
            let cur = self.player?.currentTime().seconds ?? 0
            self.notifyWebProgress(curSec: cur.isFinite ? cur : 0, durSec: self.curDurationSec, isPlaying: true)
        }
    }

    private func seekNative(to seconds: Double) {
        DispatchQueue.main.async {
            let target = CMTime(seconds: max(0, seconds), preferredTimescale: 600)
            self.player?.seek(to: target, toleranceBefore: .zero, toleranceAfter: .zero) { [weak self] _ in
                guard let self = self else { return }
                self.updateNowPlayingInfo()
                self.notifyWebProgress(curSec: seconds, durSec: self.curDurationSec, isPlaying: self.isPlayingNow)
            }
        }
    }

    private func handleTrackEnded() {
        if repeatMode == "one" {
            seekNative(to: 0)
            resumeNative()
            return
        }
        skipNextNative()
    }

    private func skipNextNative() {
        guard !queue.isEmpty else {
            pauseNative()
            return
        }
        if shuffleOn {
            currentIndex = Int.random(in: 0..<queue.count)
        } else {
            currentIndex = (currentIndex + 1) % queue.count
        }
        playFromQueueIndex(currentIndex)
    }

    private func skipPrevNative() {
        let cur = player?.currentTime().seconds ?? 0
        if cur.isFinite && cur > 4.0 {
            seekNative(to: 0)
            return
        }
        guard !queue.isEmpty else {
            seekNative(to: 0)
            return
        }
        currentIndex = (currentIndex - 1 + queue.count) % queue.count
        playFromQueueIndex(currentIndex)
    }

    private func playFromQueueIndex(_ index: Int) {
        guard index >= 0, index < queue.count else { return }
        let track = queue[index]
        let id = (track["id"] as? String) ?? ""
        let title = (track["title"] as? String) ?? "Geo Music"
        let artist = (track["artist"] as? String) ?? "Geo Music Player"
        let cover = (track["cover"] as? String) ?? ""
        let transcodingUrl = (track["transcodingUrl"] as? String) ?? ""
        let durMs = (track["durationMs"] as? Double) ?? 0

        playTrackNative(
            id: id,
            title: title,
            artist: artist,
            cover: cover,
            streamUrl: "",
            transcodingUrl: transcodingUrl,
            durationSec: durMs / 1000.0,
            autoPlay: true
        )
        notifyWebTrackChanged(trackId: id, index: index)
    }

    private func resolveSoundCloudStream(transcodingUrl: String, completion: @escaping (URL?) -> Void) {
        let sep = transcodingUrl.contains("?") ? "&" : "?"
        guard let url = URL(string: "\(transcodingUrl)\(sep)client_id=\(scClientId)") else {
            completion(nil)
            return
        }
        URLSession.shared.dataTask(with: url) { data, _, _ in
            guard let data = data,
                  let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let urlStr = obj["url"] as? String,
                  let stream = URL(string: urlStr) else {
                completion(nil)
                return
            }
            completion(stream)
        }.resume()
    }

    private func updateNowPlayingInfo() {
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: curTitle,
            MPMediaItemPropertyArtist: curArtist,
            MPMediaItemPropertyAlbumTitle: "Geo Music",
            MPNowPlayingInfoPropertyElapsedPlaybackTime: (player?.currentTime().seconds.isFinite == true) ? (player?.currentTime().seconds ?? 0) : 0,
            MPMediaItemPropertyPlaybackDuration: curDurationSec,
            MPNowPlayingInfoPropertyPlaybackRate: isPlayingNow ? playbackRate : 0.0
        ]
        if let artwork = curArtwork {
            info[MPMediaItemPropertyArtwork] = artwork
        }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    private func loadArtwork(from coverStr: String) {
        if coverStr.hasPrefix("data:image"), !coverStr.hasPrefix("data:image/svg"),
           let comma = coverStr.firstIndex(of: ",") {
            let b64 = String(coverStr[coverStr.index(after: comma)...])
            if let data = Data(base64Encoded: b64), let img = UIImage(data: data) {
                self.curArtwork = MPMediaItemArtwork(boundsSize: img.size) { _ in img }
                DispatchQueue.main.async { self.updateNowPlayingInfo() }
            }
            return
        }
        guard coverStr.hasPrefix("http"), let url = URL(string: coverStr) else { return }
        URLSession.shared.dataTask(with: url) { [weak self] data, _, _ in
            guard let self = self, self.curCover == coverStr,
                  let data = data, let img = UIImage(data: data) else { return }
            self.curArtwork = MPMediaItemArtwork(boundsSize: img.size) { _ in img }
            DispatchQueue.main.async { self.updateNowPlayingInfo() }
        }.resume()
    }

    private func setupRemoteCommands() {
        if commandsRegistered { return }
        commandsRegistered = true
        let cc = MPRemoteCommandCenter.shared()

        cc.playCommand.isEnabled = true
        cc.playCommand.addTarget { [weak self] _ in
            self?.resumeNative()
            return .success
        }

        cc.pauseCommand.isEnabled = true
        cc.pauseCommand.addTarget { [weak self] _ in
            self?.pauseNative()
            return .success
        }

        cc.togglePlayPauseCommand.isEnabled = true
        cc.togglePlayPauseCommand.addTarget { [weak self] _ in
            guard let self = self else { return .commandFailed }
            if self.isPlayingNow { self.pauseNative() } else { self.resumeNative() }
            return .success
        }

        cc.nextTrackCommand.isEnabled = true
        cc.nextTrackCommand.addTarget { [weak self] _ in
            self?.skipNextNative()
            return .success
        }

        cc.previousTrackCommand.isEnabled = true
        cc.previousTrackCommand.addTarget { [weak self] _ in
            self?.skipPrevNative()
            return .success
        }

        cc.changePlaybackPositionCommand.isEnabled = true
        cc.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let posEvent = event as? MPChangePlaybackPositionCommandEvent else { return .commandFailed }
            self?.seekNative(to: posEvent.positionTime)
            return .success
        }
    }

    private func setupInterruptionObserver() {
        interruptObserver = NotificationCenter.default.addObserver(
            forName: AVAudioSession.interruptionNotification,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            guard let self = self,
                  let info = notification.userInfo,
                  let typeVal = info[AVAudioSessionInterruptionTypeKey] as? UInt,
                  let type = AVAudioSession.InterruptionType(rawValue: typeVal) else { return }

            if type == .began {
                self.wasInterruptedWhilePlaying = self.isPlayingNow
                if self.isPlayingNow { self.pauseNative() }
            } else if type == .ended {
                let optsVal = info[AVAudioSessionInterruptionOptionKey] as? UInt ?? 0
                let opts = AVAudioSession.InterruptionOptions(rawValue: optsVal)
                if opts.contains(.shouldResume) && self.wasInterruptedWhilePlaying {
                    self.resumeNative()
                }
            }
        }
    }

    private func notifyWebProgress(curSec: Double, durSec: Double, isPlaying: Bool) {
        let js = "window.__geoNativeProgress && window.__geoNativeProgress(\(curSec), \(durSec), \(isPlaying ? "true" : "false"), '\(curTrackId)');"
        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    private func notifyWebTrackChanged(trackId: String, index: Int) {
        let js = "window.__geoNativeTrackChanged && window.__geoNativeTrackChanged('\(trackId)', \(index));"
        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}
