/** UI strings for reporter + control pages. Fallback: English. */

const STORAGE_KEY = 'traffivLang';

export const LOCALE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' }
];

const KEYS_EN = {
  doc_reporter_title: 'Reporter — Smart Emergency Response',
  doc_control_title: 'Control Panel — Smart Emergency Response',
  reporter_title: 'Emergency reporter',
  reporter_subtitle: 'Click the map to choose location first, then select report type.',
  section_report_type: 'Report type',
  section_messages: 'Messages',
  btn_report_accident: 'Report Accident',
  btn_report_fire: 'Report Fire',
  btn_report_medical: 'Report Medical',
  control_title: 'Operations control',
  control_subtitle:
    'Live reports on the left. Red dot = selected emergency. Dispatch the correct vehicle: fire → fire truck; accident / medical → ambulance.',
  section_realtime_messages: 'Real-time messages (wheel to zoom, drag to pan)',
  language_label: 'Language',
  map_alt: 'Emergency Response Map',
  hospital_ambulance_title: 'Hospital ambulance',
  msg_click_map_first: 'Click the map to select location first.',
  msg_select_location_first: 'Select location on the map first.',
  msg_report_submitted: 'Report submitted: {type} @ ({x}, {y})',
  msg_report_failed: 'Report failed to submit. Please try again.',
  msg_location_kept: 'Location kept on map. You can report again or choose a new location.',
  msg_location_selected: 'Location selected @ ({x}, {y}). Now choose emergency type.',
  type_accident: 'Accident',
  type_fire: 'Fire',
  type_medical: 'Medical',
  type_unknown: 'Other',
  status_on_the_way: 'On the way',
  status_on_hospital_way: 'Heading to hospital',
  status_successful: 'Successful',
  alert_no_emergency: 'No emergency is selected or reported.'
};

const HI = {
  doc_reporter_title: 'रिपोर्टर — स्मार्ट आपात प्रतिक्रिया',
  doc_control_title: 'नियंत्रण पैनल — स्मार्ट आपात प्रतिक्रिया',
  reporter_title: 'आपातकालीन रिपोर्टर',
  reporter_subtitle: 'पहले मानचित्र पर स्थान चुनें, फिर रिपोर्ट का प्रकार चुनें।',
  section_report_type: 'रिपोर्ट प्रकार',
  section_messages: 'संदेश',
  btn_report_accident: 'दुर्घटना की रिपोर्ट करें',
  btn_report_fire: 'आग की रिपोर्ट करें',
  btn_report_medical: 'चिकित्सा आपात की रिपोर्ट करें',
  control_title: 'संचालन नियंत्रण',
  control_subtitle:
    'बाईं ओर लाइव रिपोर्ट। लाल बिंदु = चयनित आपात। सही वाहन भेजें: आग → फायर ट्रक; दुर्घटना/चिकित्सा → एम्बुलेंस।',
  section_realtime_messages: 'रीयल-टाइम संदेश (ज़ूम: व्हील, पैन: ड्रैग)',
  language_label: 'भाषा',
  map_alt: 'आपात प्रतिक्रिया मानचित्र',
  hospital_ambulance_title: 'अस्पताल एम्बुलेंस',
  msg_click_map_first: 'पहले मानचित्र पर क्लिक करके स्थान चुनें।',
  msg_select_location_first: 'पहले मानचित्र पर स्थान चुनें।',
  msg_report_submitted: 'रिपोर्ट जमा: {type} @ ({x}, {y})',
  msg_report_failed: 'रिपोर्ट जमा नहीं हो सकी। कृपया पुनः प्रयास करें।',
  msg_location_kept: 'स्थान मानचित्र पर बना रहेगा। आप फिर रिपोर्ट कर सकते हैं या नया स्थान चुन सकते हैं।',
  msg_location_selected: 'स्थान चयनित @ ({x}, {y})। अब आपात प्रकार चुनें।',
  type_accident: 'दुर्घटना',
  type_fire: 'आग',
  type_medical: 'चिकित्सा',
  type_unknown: 'अन्य',
  status_on_the_way: 'रास्ते में',
  status_on_hospital_way: 'अस्पताल जा रहा है',
  status_successful: 'सफल',
  alert_no_emergency: 'कोई आपात चयनित या रिपोर्ट नहीं है।'
};

const TA = {
  doc_reporter_title: 'அறிக்கையாளர் — ஸ்மார்ட் அவசர பதில்',
  doc_control_title: 'கட்டுப்பாட்டு பலகை — ஸ்மார்ட் அவசர பதில்',
  reporter_title: 'அவசர அறிக்கையாளர்',
  reporter_subtitle: 'முதலில் வரைபடத்தில் இடத்தைத் தேர்ந்தெடுத்து, பின் அறிக்கை வகையைத் தேர்வு செய்யவும்.',
  section_report_type: 'அறிக்கை வகை',
  section_messages: 'செய்திகள்',
  btn_report_accident: 'விபத்து அறிக்கை',
  btn_report_fire: 'தீ அறிக்கை',
  btn_report_medical: 'மருத்துவ அவசர அறிக்கை',
  control_title: 'செயல்பாட்டுக் கட்டுப்பாடு',
  control_subtitle:
    'இடதுபுறம் நேரடி அறிக்கைகள். சிவப்புப் புள்ளி = தேர்ந்த அவசரம். சரியான வாகனம்: தீ → தீயணைப்பு; விபத்து/மருத்துவம் → ஆம்புலன்ஸ்.',
  section_realtime_messages: 'நேரட் செய்திகள் (ஜூம்: சக்கரம், நகர்த்தல்: இழுத்தல்)',
  language_label: 'மொழி',
  map_alt: 'அவசர பதில் வரைபடம்',
  hospital_ambulance_title: 'மருத்துவமனை ஆம்புலன்ஸ்',
  msg_click_map_first: 'முதலில் வரைபடத்தில் கிளிக் செய்து இடத்தைத் தேர்ந்தெடுக்கவும்.',
  msg_select_location_first: 'முதலில் வரைபடத்தில் இடத்தைத் தேர்ந்தெடுக்கவும்.',
  msg_report_submitted: 'அறிக்கை சமர்ப்பிக்கப்பட்டது: {type} @ ({x}, {y})',
  msg_report_failed: 'அறிக்கை சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயலவும்.',
  msg_location_kept: 'இடம் வரைபடத்தில் உள்ளது. மீண்டும் அறிவிக்கலாம் அல்லது புதிய இடத்தைத் தேர்வு செய்யலாம்.',
  msg_location_selected: 'இடம் தேர்ந்தெடுக்கப்பட்டது @ ({x}, {y}). இப்போது அவசர வகையைத் தேர்வு செய்யவும்.',
  type_accident: 'விபத்து',
  type_fire: 'தீ',
  type_medical: 'மருத்துவம்',
  type_unknown: 'மற்றவை',
  status_on_the_way: 'வழியில்',
  status_on_hospital_way: 'மருத்துவமனைக்குச் செல்கிறது',
  status_successful: 'வெற்றி',
  alert_no_emergency: 'அவசரம் தேர்ந்தெடுக்கப்படவில்லை அல்லது அறிவிக்கப்படவில்லை.'
};

const PA = {
  doc_reporter_title: 'ਰਿਪੋਰਟਰ — ਸਮਾਰਟ ਐਮਰਜੈਂਸੀ ਜਵਾਬ',
  doc_control_title: 'ਕੰਟਰੋਲ ਪੈਨਲ — ਸਮਾਰਟ ਐਮਰਜੈਂਸੀ ਜਵਾਬ',
  reporter_title: 'ਐਮਰਜੈਂਸੀ ਰਿਪੋਰਟਰ',
  reporter_subtitle: 'ਪਹਿਲਾਂ ਨਕਸ਼ੇ \'ਤੇ ਟਿਕਾਣਾ ਚੁਣੋ, ਫਿਰ ਰਿਪੋਰਟ ਦੀ ਕਿਸਮ ਚੁਣੋ।',
  section_report_type: 'ਰਿਪੋਰਟ ਦੀ ਕਿਸਮ',
  section_messages: 'ਸੁਨੇਹੇ',
  btn_report_accident: 'ਦੁਰਘਟਨਾ ਦੀ ਰਿਪੋਰਟ',
  btn_report_fire: 'ਅੱਗ ਦੀ ਰਿਪੋਰਟ',
  btn_report_medical: 'ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਦੀ ਰਿਪੋਰਟ',
  control_title: 'ਓਪਰੇਸ਼ਨ ਕੰਟਰੋਲ',
  control_subtitle:
    'ਖੱਬੇ ਲਾਈਵ ਰਿਪੋਰਟਾਂ। ਲਾਲ ਬਿੰਦੂ = ਚੁਣੀ ਐਮਰਜੈਂਸੀ। ਸਹੀ ਗੱਡੀ ਭੇਜੋ: ਅੱਗ → ਫਾਇਰ ਟਰੱਕ; ਦੁਰਘਟਨਾ/ਮੈਡੀਕਲ → ਐਂਬੂਲੈਂਸ।',
  section_realtime_messages: 'ਰੀਅਲ-ਟਾਈਮ ਸੁਨੇਹੇ (ਜ਼ੂਮ: ਵ੍ਹੀਲ, ਪੈਨ: ਖਿੱਚੋ)',
  language_label: 'ਭਾਸ਼ਾ',
  map_alt: 'ਐਮਰਜੈਂਸੀ ਜਵਾਬ ਨਕਸ਼ਾ',
  hospital_ambulance_title: 'ਹਸਪਤਾਲ ਐਂਬੂਲੈਂਸ',
  msg_click_map_first: 'ਪਹਿਲਾਂ ਨਕਸ਼ੇ \'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਟਿਕਾਣਾ ਚੁਣੋ।',
  msg_select_location_first: 'ਪਹਿਲਾਂ ਨਕਸ਼ੇ \'ਤੇ ਟਿਕਾਣਾ ਚੁਣੋ।',
  msg_report_submitted: 'ਰਿਪੋਰਟ ਜਮਾ: {type} @ ({x}, {y})',
  msg_report_failed: 'ਰਿਪੋਰਟ ਜਮਾ ਨਹੀਂ ਹੋ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  msg_location_kept: 'ਟਿਕਾਣਾ ਨਕਸ਼ੇ \'ਤੇ ਰਹਿੰਦਾ ਹੈ। ਤੁਸੀਂ ਦੁਬਾਰਾ ਰਿਪੋਰਟ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਨਵਾਂ ਟਿਕਾਣਾ ਚੁਣ ਸਕਦੇ ਹੋ।',
  msg_location_selected: 'ਟਿਕਾਣਾ ਚੁਣਿਆ @ ({x}, {y}). ਹੁਣ ਐਮਰਜੈਂਸੀ ਦੀ ਕਿਸਮ ਚੁਣੋ।',
  type_accident: 'ਦੁਰਘਟਨਾ',
  type_fire: 'ਅੱਗ',
  type_medical: 'ਮੈਡੀਕਲ',
  type_unknown: 'ਹੋਰ',
  status_on_the_way: 'ਰਸਤੇ ਵਿੱਚ',
  status_on_hospital_way: 'ਹਸਪਤਾਲ ਵੱਲ ਜਾ ਰਿਹਾ ਹੈ',
  status_successful: 'ਸਫਲ',
  alert_no_emergency: 'ਕੋਈ ਐਮਰਜੈਂਸੀ ਚੁਣੀ ਜਾਂ ਰਿਪੋਰਟ ਨਹੀਂ ਹੈ।'
};

const KN = {
  doc_reporter_title: 'ವರದಿದಾರ — ಸ್ಮಾರ್ಟ್ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
  doc_control_title: 'ನಿಯಂತ್ರಣ ಫಲಕ — ಸ್ಮಾರ್ಟ್ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
  reporter_title: 'ತುರ್ತು ವರದಿದಾರ',
  reporter_subtitle: 'ಮೊದಲು ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಂತರ ವರದಿ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ.',
  section_report_type: 'ವರದಿ ಪ್ರಕಾರ',
  section_messages: 'ಸಂದೇಶಗಳು',
  btn_report_accident: 'ಅಪಘಾತ ವರದಿ',
  btn_report_fire: 'ಬೆಂಕಿ ವರದಿ',
  btn_report_medical: 'ವೈದ್ಯಕೀಯ ತುರ್ತು ವರದಿ',
  control_title: 'ಕಾರ್ಯಾಚರಣೆ ನಿಯಂತ್ರಣ',
  control_subtitle:
    'ಎಡಕ್ಕೆ ಲೈವ್ ವರದಿಗಳು. ಕೆಂಪು ಬಿಂದು = ಆಯ್ಕೆಮಾಡಿದ ತುರ್ತು. ಸರಿಯಾದ ವಾಹನ: ಬೆಂಕಿ → ಫೈರ್ ಟ್ರಕ್; ಅಪಘಾತ/ವೈದ್ಯಕೀಯ → ಆಂಬ್ಯುಲೆನ್ಸ್.',
  section_realtime_messages: 'ನೈಜ-ಸಮಯದ ಸಂದೇಶಗಳು (ಜೂಮ್: ಚಕ್ರ, ಪ್ಯಾನ್: ಎಳೆಯಿರಿ)',
  language_label: 'ಭಾಷೆ',
  map_alt: 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ನಕ್ಷೆ',
  hospital_ambulance_title: 'ಆಸ್ಪತ್ರೆ ಆಂಬ್ಯುಲೆನ್ಸ್',
  msg_click_map_first: 'ಮೊದಲು ನಕ್ಷೆಯಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  msg_select_location_first: 'ಮೊದಲು ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  msg_report_submitted: 'ವರದಿ ಸಲ್ಲಿಕೆ: {type} @ ({x}, {y})',
  msg_report_failed: 'ವರದಿ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  msg_location_kept: 'ಸ್ಥಳ ನಕ್ಷೆಯಲ್ಲೇ ಉಳಿದಿದೆ. ನೀವು ಮತ್ತೆ ವರದಿ ಮಾಡಬಹುದು ಅಥವಾ ಹೊಸ ಸ್ಥಳ ಆರಿಸಬಹುದು.',
  msg_location_selected: 'ಸ್ಥಳ ಆಯ್ಕೆ @ ({x}, {y}). ಈಗ ತುರ್ತು ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ.',
  type_accident: 'ಅಪಘಾತ',
  type_fire: 'ಬೆಂಕಿ',
  type_medical: 'ವೈದ್ಯಕೀಯ',
  type_unknown: 'ಇತರೆ',
  status_on_the_way: 'ಮಾರ್ಗದಲ್ಲಿ',
  status_on_hospital_way: 'ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುತ್ತಿದೆ',
  status_successful: 'ಯಶಸ್ವಿ',
  alert_no_emergency: 'ಯಾವುದೇ ತುರ್ತು ಆಯ್ಕೆಯಾಗಿಲ್ಲ ಅಥವಾ ವರದಿಯಾಗಿಲ್ಲ.'
};

const GU = {
  doc_reporter_title: 'રિપોર્ટર — સ્માર્ટ ઇમરજન્સી પ્રતિસાદ',
  doc_control_title: 'કંટ્રોલ પેનલ — સ્માર્ટ ઇમરજન્સી પ્રતિસાદ',
  reporter_title: 'ઇમરજન્સી રિપોર્ટર',
  reporter_subtitle: 'પહેલા નકશા પર સ્થાન પસંદ કરો, પછી રિપોર્ટ પ્રકાર પસંદ કરો.',
  section_report_type: 'રિપોર્ટ પ્રકાર',
  section_messages: 'સંદેશાઓ',
  btn_report_accident: 'અકસ્માતની રિપોર્ટ',
  btn_report_fire: 'આગની રિપોર્ટ',
  btn_report_medical: 'તબીબી ઇમરજન્સીની રિપોર્ટ',
  control_title: 'ઓપરેશન્સ કંટ્રોલ',
  control_subtitle:
    'ડાબી બાજુ લાઇવ રિપોર્ટ્સ. લાલ બિંદુ = પસંદ કરેલી ઇમરજન્સી. સાચું વાહન મોકલો: આગ → ફાયર ટ્રક; અકસ્માત/તબીબી → એમ્બ્યુલન્સ.',
  section_realtime_messages: 'રીઅલ-ટાઇમ સંદેશાઓ (ઝૂમ: વ્હીલ, પૅન: ખેંચો)',
  language_label: 'ભાષા',
  map_alt: 'ઇમરજન્સી પ્રતિસાદ નકશો',
  hospital_ambulance_title: 'હોસ્પિટલ એમ્બ્યુલન્સ',
  msg_click_map_first: 'પહેલા નકશા પર ક્લિક કરી સ્થાન પસંદ કરો.',
  msg_select_location_first: 'પહેલા નકશા પર સ્થાન પસંદ કરો.',
  msg_report_submitted: 'રિપોર્ટ સબમિટ: {type} @ ({x}, {y})',
  msg_report_failed: 'રિપોર્ટ સબમિટ ન થઈ શકી. ફરી પ્રયાસ કરો.',
  msg_location_kept: 'સ્થાન નકશા પર રહેશે. તમે ફરી રિપોર્ટ કરી શકો અથવા નવું સ્થાન પસંદ કરી શકો.',
  msg_location_selected: 'સ્થાન પસંદ @ ({x}, {y}). હવે ઇમરજન્સી પ્રકાર પસંદ કરો.',
  type_accident: 'અકસ્માત',
  type_fire: 'આગ',
  type_medical: 'તબીબી',
  type_unknown: 'અન્ય',
  status_on_the_way: 'રસ્તામાં',
  status_on_hospital_way: 'હોસ્પિટલ તરફ જઈ રહ્યું છે',
  status_successful: 'સફળ',
  alert_no_emergency: 'કોઈ ઇમરજન્સી પસંદ અથવા રિપોર્ટ નથી.'
};

const OR = {
  doc_reporter_title: 'ରିପୋର୍ଟର — ସ୍ମାର୍ଟ ଜରୁରୀକାଳୀନ ପ୍ରତିକ୍ରିୟା',
  doc_control_title: 'ନିୟନ୍ତ୍ରଣ ପ୍ୟାନେଲ — ସ୍ମାର୍ଟ ଜରୁରୀକାଳୀନ ପ୍ରତିକ୍ରିୟା',
  reporter_title: 'ଜରୁରୀକାଳୀନ ରିପୋର୍ଟର',
  reporter_subtitle: 'ପ୍ରଥମେ ମାନଚିତ୍ରରେ ସ୍ଥାନ ବାଛନ୍ତୁ, ତାପରେ ରିପୋର୍ଟ ପ୍ରକାର ବାଛନ୍ତୁ।',
  section_report_type: 'ରିପୋର୍ଟ ପ୍ରକାର',
  section_messages: 'ସନ୍ଦେଶ',
  btn_report_accident: 'ଦୁର୍ଘଟଣା ରିପୋର୍ଟ',
  btn_report_fire: 'ନିଆଁ ରିପୋର୍ଟ',
  btn_report_medical: 'ଚିକିତ୍ସା ଜରୁରୀକାଳୀନ ରିପୋର୍ଟ',
  control_title: 'ଅପରେସନ ନିୟନ୍ତ୍ରଣ',
  control_subtitle:
    'ବାମପଟେ ଲାଇଭ୍ ରିପୋର୍ଟ। ଲାଲ ବିନ୍ଦୁ = ବଚ୍ଛିତ ଜରୁରୀକାଳୀନ। ଠିକ୍ ଯାନ ପଠାନ୍ତୁ: ନିଆଁ → ଫାୟାର ଟ୍ରକ୍; ଦୁର୍ଘଟଣା/ଚିକିତ୍ସା → ଆମ୍ବୁଲାନ୍ସ।',
  section_realtime_messages: 'ରିଅଲ-ଟାଇମ ସନ୍ଦେଶ (ଜୁମ୍: ଚକ, ପ୍ୟାନ୍: ଟାଣନ୍ତୁ)',
  language_label: 'ଭାଷା',
  map_alt: 'ଜରୁରୀକାଳୀନ ପ୍ରତିକ୍ରିୟା ମାନଚିତ୍ର',
  hospital_ambulance_title: 'ଡାକ୍ତରଖାନା ଆମ୍ବୁଲାନ୍ସ',
  msg_click_map_first: 'ପ୍ରଥମେ ମାନଚିତ୍ରରେ କ୍ଲିକ୍ କରି ସ୍ଥାନ ବାଛନ୍ତୁ।',
  msg_select_location_first: 'ପ୍ରଥମେ ମାନଚିତ୍ରରେ ସ୍ଥାନ ବାଛନ୍ତୁ।',
  msg_report_submitted: 'ରିପୋର୍ଟ ଦାଖଲ: {type} @ ({x}, {y})',
  msg_report_failed: 'ରିପୋର୍ଟ ଦାଖଲ ହେଲା ନାହିଁ। ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।',
  msg_location_kept: 'ସ୍ଥାନ ମାନଚିତ୍ରରେ ରହିବ। ଆପଣ ପୁନଃ ରିପୋର୍ଟ କରିପାରିବେ କିମ୍ବା ନୂଆ ସ୍ଥାନ ବାଛିପାରିବେ।',
  msg_location_selected: 'ସ୍ଥାନ ବଚ୍ଛିତ @ ({x}, {y}). ଏବେ ଜରୁରୀକାଳୀନ ପ୍ରକାର ବାଛନ୍ତୁ।',
  type_accident: 'ଦୁର୍ଘଟଣା',
  type_fire: 'ନିଆଁ',
  type_medical: 'ଚିକିତ୍ସା',
  type_unknown: 'ଅନ୍ୟ',
  status_on_the_way: 'ରାସ୍ତାରେ',
  status_on_hospital_way: 'ଡାକ୍ତରଖାନାକୁ ଯାଉଛି',
  status_successful: 'ସଫଳ',
  alert_no_emergency: 'କୌଣସି ଜରୁରୀକାଳୀନ ବଚ୍ଛିତ କିମ୍ବା ରିପୋର୍ଟ ନାହିଁ।'
};

const BN = {
  doc_reporter_title: 'রিপোর্টার — স্মার্ট জরুরি প্রতিক্রিয়া',
  doc_control_title: 'নিয়ন্ত্রণ প্যানেল — স্মার্ট জরুরি প্রতিক্রিয়া',
  reporter_title: 'জরুরি রিপোর্টার',
  reporter_subtitle: 'প্রথমে মানচিত্রে অবস্থান বেছে নিন, তারপর রিপোর্টের ধরন বেছে নিন।',
  section_report_type: 'রিপোর্টের ধরন',
  section_messages: 'বার্তা',
  btn_report_accident: 'দুর্ঘটনার রিপোর্ট',
  btn_report_fire: 'আগুনের রিপোর্ট',
  btn_report_medical: 'চিকিৎসা জরুরি রিপোর্ট',
  control_title: 'অপারেশন নিয়ন্ত্রণ',
  control_subtitle:
    'বামে লাইভ রিপোর্ট। লাল বিন্দু = নির্বাচিত জরুরি। সঠিক যান পাঠান: আগুন → ফায়ার ট্রাক; দুর্ঘটনা/চিকিৎসা → অ্যাম্বুলেন্স।',
  section_realtime_messages: 'রিয়েল-টাইম বার্তা (জুম: চাকা, প্যান: টেনে আনুন)',
  language_label: 'ভাষা',
  map_alt: 'জরুরি প্রতিক্রিয়া মানচিত্র',
  hospital_ambulance_title: 'হাসপাতালের অ্যাম্বুলেন্স',
  msg_click_map_first: 'প্রথমে মানচিত্রে ক্লিক করে অবস্থান বেছে নিন।',
  msg_select_location_first: 'প্রথমে মানচিত্রে অবস্থান বেছে নিন।',
  msg_report_submitted: 'রিপোর্ট জমা: {type} @ ({x}, {y})',
  msg_report_failed: 'রিপোর্ট জমা হয়নি। আবার চেষ্টা করুন।',
  msg_location_kept: 'অবস্থান মানচিত্রে থাকবে। আপনি আবার রিপোর্ট করতে পারেন বা নতুন অবস্থান বেছে নিতে পারেন।',
  msg_location_selected: 'অবস্থান নির্বাচিত @ ({x}, {y})। এখন জরুরির ধরন বেছে নিন।',
  type_accident: 'দুর্ঘটনা',
  type_fire: 'আগুন',
  type_medical: 'চিকিৎসা',
  type_unknown: 'অন্যান্য',
  status_on_the_way: 'পথে',
  status_on_hospital_way: 'হাসপাতালে যাচ্ছে',
  status_successful: 'সফল',
  alert_no_emergency: 'কোনো জরুরি নির্বাচিত বা রিপোর্ট করা হয়নি।'
};

const MR = {
  doc_reporter_title: 'रिपोर्टर — स्मार्ट आपत्कालीन प्रतिसाद',
  doc_control_title: 'नियंत्रण पॅनेल — स्मार्ट आपत्कालीन प्रतिसाद',
  reporter_title: 'आपत्कालीन रिपोर्टर',
  reporter_subtitle: 'प्रथम नकाशावर ठिकाण निवडा, नंतर अहवाल प्रकार निवडा.',
  section_report_type: 'अहवाल प्रकार',
  section_messages: 'संदेश',
  btn_report_accident: 'अपघाताचा अहवाल',
  btn_report_fire: 'आगीचा अहवाल',
  btn_report_medical: 'वैद्यकीय आपत्कालीन अहवाल',
  control_title: 'ऑपरेशन्स नियंत्रण',
  control_subtitle:
    'डावीकडे थेट अहवाल. लाल बिंदू = निवडलेले आपत्कालीन. योग्य वाहन पाठवा: आग → फायर ट्रक; अपघात/वैद्यकीय → रुग्णवाहिका.',
  section_realtime_messages: 'रिअल-टाइम संदेश (झूम: चाक, पॅन: ड्रॅग)',
  language_label: 'भाषा',
  map_alt: 'आपत्कालीन प्रतिसाद नकाशा',
  hospital_ambulance_title: 'रुग्णालय रुग्णवाहिका',
  msg_click_map_first: 'प्रथम नकाशावर क्लिक करून ठिकाण निवडा.',
  msg_select_location_first: 'प्रथम नकाशावर ठिकाण निवडा.',
  msg_report_submitted: 'अहवाल सादर: {type} @ ({x}, {y})',
  msg_report_failed: 'अहवाल सादर होऊ शकला नाही. पुन्हा प्रयत्न करा.',
  msg_location_kept: 'ठिकाण नकाशावर राहते. तुम्ही पुन्हा अहवाल देऊ शकता किंवा नवे ठिकाण निवडू शकता.',
  msg_location_selected: 'ठिकाण निवडले @ ({x}, {y}). आता आपत्कालीन प्रकार निवडा.',
  type_accident: 'अपघात',
  type_fire: 'आग',
  type_medical: 'वैद्यकीय',
  type_unknown: 'इतर',
  status_on_the_way: 'मार्गावर',
  status_on_hospital_way: 'रुग्णालयाकडे जात आहे',
  status_successful: 'यशस्वी',
  alert_no_emergency: 'कोणतेही आपत्कालीन निवडलेले किंवा अहवाल दिलेले नाही.'
};

export const STRINGS = {
  en: KEYS_EN,
  hi: HI,
  ta: TA,
  pa: PA,
  kn: KN,
  gu: GU,
  or: OR,
  bn: BN,
  mr: MR
};

let currentLocale = 'en';
const listeners = new Set();

function readStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && STRINGS[v]) return v;
  } catch {
    /* ignore */
  }
  return 'en';
}

currentLocale = readStoredLocale();
if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLocale;
}

export function getLocale() {
  return currentLocale;
}

export function setLocale(code) {
  const next = STRINGS[code] ? code : 'en';
  currentLocale = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next;
  listeners.forEach((fn) => {
    try {
      fn(next);
    } catch (e) {
      console.error('[i18n] listener error', e);
    }
  });
}

export function subscribeLocale(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key, params = {}) {
  const table = STRINGS[currentLocale] || STRINGS.en;
  let s = table[key] ?? STRINGS.en[key] ?? key;
  for (const [k, v] of Object.entries(params)) {
    s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return s;
}

export function applyDataI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (key) el.setAttribute('alt', t(key));
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.setAttribute('title', t(key));
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key) el.setAttribute('aria-label', t(key));
  });
}

export function initLangSelect() {
  const sel = document.getElementById('langSelect');
  if (!sel || sel.dataset.i18nWired === '1') return;
  sel.dataset.i18nWired = '1';
  sel.innerHTML = '';
  for (const { code, label } of LOCALE_OPTIONS) {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = label;
    sel.appendChild(o);
  }
  sel.value = getLocale();
  sel.addEventListener('change', () => setLocale(sel.value));
}

export function syncLangSelectValue() {
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = getLocale();
}
