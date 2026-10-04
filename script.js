const quranAudio = document.getElementById('quranAudio');
const quranPlayBtn = document.getElementById('quranPlayBtn');
const surahSelect = document.getElementById('surahSelect');
const quranVolume = document.getElementById('quranVolume');
const customNameInput = document.getElementById('customNameInput');
const mp3FileInput = document.getElementById('mp3FileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const addSurahBtn = document.getElementById('addSurahBtn');

let selectedFileUrl = '';

// التعامل مع اختيار الملف من الجهاز وتوليد رابط مؤقت له
mp3FileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFileUrl = URL.createObjectURL(file);
        fileNameDisplay.textContent = `تم اختيار: ${file.name}`;
        if (!customNameInput.value) {
            // اقتراح اسم افتراضي من اسم الملف بدون امتداد
            customNameInput.value = file.name.replace(/\.[^/.]+$/, "");
        }
    }
});

// استرجاع السور المحفوظة في الذاكرة المحلية
let customSurahs = JSON.parse(localStorage.getItem('customSurahs')) || [];

function loadSurahsToDropdown() {
    surahSelect.innerHTML = `
        <option value="https://server11.mp3quran.net/sds/056.mp3">سورة الواقعة - عبد الرحمن السديس</option>
        <option value="https://server11.mp3quran.net/sds/067.mp3">سورة الملك - عبد الرحمن السديس</option>
    `;
    
    customSurahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.url;
        option.textContent = surah.name;
        surahSelect.appendChild(option);
    });
}

loadSurahsToDropdown();

// زر إضافة السورة من الملف المحدد
addSurahBtn.addEventListener('click', () => {
    const name = customNameInput.value.trim();

    if (!name || !selectedFileUrl) {
        alert('الرجاء كتابة اسم السورة واختيار ملف MP3 من الجهاز أولاً!');
        return;
    }

    // حفظ في القائمة المحلية (ملاحظة: روابط الجهاز المحلية المؤقتة تعمل طوال فترة فتح المتصفح)
    customSurahs.push({ name: name, url: selectedFileUrl });
    localStorage.setItem('customSurahs', JSON.stringify(customSurahs));

    loadSurahsToDropdown();
    surahSelect.value = selectedFileUrl;
    quranAudio.src = selectedFileUrl;
    quranAudio.play().then(() => {
        quranPlayBtn.textContent = 'إيقاف القرآن';
        quranPlayBtn.classList.add('playing');
    });

    customNameInput.value = '';
    fileNameDisplay.textContent = 'لم يتم اختيار أي ملف';
    selectedFileUrl = '';
    alert('تمت إضافة السورة بنجاح وتشغيلها!');
});

quranAudio.src = surahSelect.value;
const savedQuranVol = localStorage.getItem('quranVolume');
if (savedQuranVol !== null) {
    quranVolume.value = savedQuranVol;
}
quranAudio.volume = quranVolume.value;

quranPlayBtn.addEventListener('click', () => {
    if (quranAudio.paused) {
        quranAudio.play().then(() => {
            quranPlayBtn.textContent = 'إيقاف القرآن';
            quranPlayBtn.classList.add('playing');
        }).catch(error => {
            console.log("خطأ في التشغيل:", error);
        });
    } else {
        quranAudio.pause();
        quranPlayBtn.textContent = 'تشغيل القرآن';
        quranPlayBtn.classList.remove('playing');
    }
});

surahSelect.addEventListener('change', () => {
    quranAudio.src = surahSelect.value;
    quranAudio.play().then(() => {
        quranPlayBtn.textContent = 'إيقاف القرآن';
        quranPlayBtn.classList.add('playing');
    }).catch(error => {
        quranPlayBtn.textContent = 'تشغيل القرآن';
        quranPlayBtn.classList.remove('playing');
    });
});

quranVolume.addEventListener('input', (e) => {
    quranAudio.volume = e.target.value;
    localStorage.setItem('quranVolume', e.target.value);
});


// نظام أصوات الطبيعة (المطر، الرعد، والرياح الهادئة)
const ambientItems = document.querySelectorAll('.ambient-item');

ambientItems.forEach(item => {
    const toggleBtn = item.querySelector('.ambient-toggle');
    const volumeSlider = item.querySelector('.volume-slider');
    const targetAudioId = toggleBtn.getAttribute('data-target');
    const audioElement = document.getElementById(targetAudioId);

    const savedVol = localStorage.getItem(targetAudioId + '_vol');
    if (savedVol !== null) {
        volumeSlider.value = savedVol;
    }
    audioElement.volume = volumeSlider.value;

    toggleBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play().then(() => {
                toggleBtn.textContent = 'إيقاف';
                toggleBtn.classList.add('playing');
            });
        } else {
            audioElement.pause();
            toggleBtn.textContent = 'تشغيل';
            toggleBtn.classList.remove('playing');
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audioElement.volume = e.target.value;
        localStorage.setItem(targetAudioId + '_vol', e.target.value);
    });
});