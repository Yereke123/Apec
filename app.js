// Настройка: Ссылка на ваш сайт-генератор контактов
const CONTACTS_SITE_URL = "https://qannabic.github.io/contacts.github.io/"; 

// Функция для получения параметра из URL (?id=eldar)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadProfile(id) {
  // Если ID нет
  if (!id) {
    document.body.innerHTML = "<h3 style='text-align:center; margin-top:20px; color:red;'>Ошибка: ID пользователя не указан в ссылке</h3>";
    return;
  }

  // --- 1. СРАЗУ НАСТРАИВАЕМ ПЕРЕХОД НА ВТОРОЙ САЙТ ---
  // Делаем это ДО загрузки JSON. Кнопка будет работать 100%, даже если база данных зависнет.
  const finalSaveLink = `${CONTACTS_SITE_URL}?id=${id}`;
  
  // Большая кнопка
  const btnSave = document.getElementById("btnSaveContact");
  if (btnSave) {
      btnSave.href = finalSaveLink;
  }

  // Маленькая иконка (внизу справа)
  const btnSaveIcon = document.getElementById("btnSaveContactIcon");
  if (btnSaveIcon) {
      btnSaveIcon.href = finalSaveLink;
  }

  // --- 2. ТЕПЕРЬ ЗАГРУЖАЕМ ДАННЫЕ ПРОФИЛЯ ---
  try {
    const response = await fetch("vizitka_data.json");
    if (!response.ok) throw new Error("Не удалось загрузить базу данных");

    const data = await response.json();
    const person = data[id];

    // Если пользователя нет в базе
    if (!person) {
      document.body.innerHTML = "<h3 style='text-align:center; margin-top:20px; color:red;'>Пользователь не найден</h3>";
      return;
    }

    // Заполняем ФИО и Должность
    document.getElementById("fullName").textContent = `${person.firstName} ${person.lastName}`;
    document.getElementById("jobTitle").textContent = person.jobTitle || "Сотрудник";

    // Фото
    const imgEl = document.getElementById("userPhoto");
    if (person.photo) {
      imgEl.src = person.photo;
    }

    // Кнопка WhatsApp
    const cleanPhone = person.phone.replace(/\D/g, ''); 
    const waLink = `https://wa.me/${cleanPhone}`;
    document.getElementById("btnWhatsapp").href = waLink;

// --- Новый код ---
// Кнопка Email
const btnEmail = document.getElementById("btnEmail");

if (person.email) {
    if (btnEmail) {
        // Проверяем, мобильное ли устройство
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // ДЛЯ ТЕЛЕФОНОВ: Используем стандартный mailto
            // Это откроет родное приложение почты (Gmail или Apple Mail)
            btnEmail.href = `mailto:${person.email}`;
            btnEmail.removeAttribute("target"); // Убираем _blank, чтобы не открывало пустую вкладку
        } else {
            // ДЛЯ КОМПЬЮТЕРОВ: Открываем веб-интерфейс Gmail в новой вкладке
            btnEmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}`;
            btnEmail.target = "_blank";
        }
    }
} else {
    // Если почты нет, скрываем кнопку
    if (btnEmail) btnEmail.style.display = "none";
}
  } catch (error) {
    console.error(error);
    // Кнопка сохранения всё равно работает, так как настроена в шаге 1
  }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const currentId = getQueryParam("id");
    loadProfile(currentId); 

});
