// Функция для получения параметра из URL (?id=murat)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Функция для генерации и скачивания VCF-файла
function downloadVCard(person) {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${person.lastName};${person.firstName};;;
FN:${person.firstName} ${person.lastName}
TEL;TYPE=CELL:${person.phone}
EMAIL;TYPE=INTERNET:${person.email}
TITLE:${person.jobTitle}
ORG:APEC
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${person.firstName}_${person.lastName}.vcf`;
  a.click();
  
  URL.revokeObjectURL(url);
}

async function loadProfile(id) {
  const defaultId = id || "murat";

  try {
    const response = await fetch("vizitka_data.json");
    if (!response.ok) throw new Error("Не удалось загрузить базу данных");

    const data = await response.json();
    const person = data[defaultId];

    if (!person) {
      document.body.innerHTML = "<h3 style='text-align:center; margin-top:20px; color:red;'>Пользователь не найден</h3>";
      return;
    }

    // Заполняем данные на странице
    document.getElementById("fullName").textContent = `${person.firstName} ${person.lastName}`;
    document.getElementById("jobTitle").textContent = person.jobTitle || "Сотрудник";

    const imgEl = document.getElementById("userPhoto");
    if (person.photo) imgEl.src = person.photo;

    // Настройка WhatsApp
    const cleanPhone = person.phone.replace(/\D/g, ''); 
    document.getElementById("btnWhatsapp").href = `https://wa.me/${cleanPhone}`;

    // Настройка Email
    const btnEmail = document.getElementById("btnEmail");
    if (person.email) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      btnEmail.href = isMobile ? `mailto:${person.email}` : `https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}`;
      if (!isMobile) btnEmail.target = "_blank";
    } else if (btnEmail) {
      btnEmail.style.display = "none";
    }

    // --- ОЖИВЛЯЕМ КНОПКУ СОХРАНЕНИЯ КОНТАКТА ---
    const btnSave = document.getElementById("btnSaveContact");
    if (btnSave) {
        // Убираем старую ссылку, если она была
        btnSave.href = "javascript:void(0)"; 
        btnSave.addEventListener("click", (e) => {
            e.preventDefault();
            downloadVCard(person);
        });
    }

  } catch (error) {
    console.error("Ошибка:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentId = getQueryParam("id");
    loadProfile(currentId); 
});