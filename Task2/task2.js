function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function updateInfo() {
  const images = document.querySelectorAll('.gallery-container img');
  const imageCount = images.length;
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  const infoHeader = document.getElementById('info-header');
  infoHeader.textContent = `На странице ${imageCount} изображений | ${formattedDate}`;
}

document.addEventListener('DOMContentLoaded', function() {
  updateInfo();

  setInterval(updateInfo, 60000);

  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeButton = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');

  const images = document.querySelectorAll('.gallery-container img');
  images.forEach(function(img) {
    img.addEventListener('click', function() {
      modalImage.src = this.src;
      modalImage.alt = this.alt;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', closeModal);

  modalImage.addEventListener('click', function(event) {
    event.stopPropagation();
  });
});
