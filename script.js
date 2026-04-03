// Функция для получения параметра из URL, например ?id=eldar
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadContact(id) {
  if (!id) return;

  try {
    const response = await fetch("contacts.json");
    if (!response.ok) throw new Error("Не удалось загрузить контакты");

    const contacts = await response.json();

    if (!contacts[id]) {
      alert("Контакт не найден");
      return;
    }

    const person = contacts[id];
    document.getElementById("firstName").value = person.firstName || "";
    document.getElementById("lastName").value = person.lastName || "";
    document.getElementById("phone").value = person.phone || "";

  } catch (error) {
    alert(error.message);
  }
}

function saveVCard() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!firstName && !lastName && !phone) {
    alert("Пожалуйста, заполните хотя бы одно поле");
    return;
  }

  const fullName = `${firstName} ${lastName}`.trim();

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
TEL;TYPE=CELL:${phone}
END:VCARD
  `.trim();

  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fullName || "contact"}.vcf`;
  a.click();

  URL.revokeObjectURL(url);
}

document.getElementById("saveBtn").addEventListener("click", saveVCard);

// Загружаем контакт при загрузке страницы
const contactId = getQueryParam("id");
loadContact(contactId);
