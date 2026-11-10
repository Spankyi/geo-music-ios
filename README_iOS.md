# Geo Music Player — iOS Edition (Clean Build)

نسخة الآيفون الاحترافية من برنامج **Geo Music Player** مصممة بواجهة **iOS Native** بالكامل، وبحالة **Clean 100%** (بدون أي أغاني محفوظة مسبقاً على جهازك، ليبدأ مستخدم الآيفون بتحميل وحفظ الأغاني التي يحبها فقط).

## طريقة استخراج ملف `.ipa` لتثبيته على الآيفون (بدون جهاز Mac):
بما أن أنظمة Apple تتطلب بيئة macOS / Xcode لترجمة مشروع iOS وإخراج ملف `.ipa`:
1. ارفع مجلد `music-player-ios` هذا بالكامل إلى مستودع (Repository) على **GitHub**.
2. اذهب إلى تبويب **Actions** في GitHub، واضغط على **Build Geo Music iOS (.ipa)** -> **Run workflow**.
3. خلال دقائق قليلة سينتج لك ملف **`GeoMusicPlayer-iOS.ipa`** جاهزاً للتحميل والتثبيت على أي جهاز iPhone عبر **Sideloadly** أو **AltStore** أو **SideStore**.

## طريقة التثبيت المباشر على Mac / Xcode:
1. افتح الملف `ios/App/App.xcodeproj` داخل **Xcode**.
2. اختر جهاز الآيفون الخاص بك وأضف حساب Apple ID في **Signing & Capabilities**.
3. اضغط **Run (⌘R)**.
