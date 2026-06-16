document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo leer el archivo del footer.');
                }
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => {
                console.error('Error cargando el footer dinámico:', error);
            });
    }

    const locationPath = window.location.pathname;
    const pageName = locationPath.substring(locationPath.lastIndexOf("/") + 1);
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    if (pageName === "index.html" || pageName === "") {
        document.getElementById('link-index')?.classList.add('active');
    } else if (pageName === "nosotros.html") {
        document.getElementById('link-nosotros')?.classList.add('active');
    } else if (pageName === "servicios.html") {
        document.getElementById('link-servicios')?.classList.add('active');
    } else if (pageName === "galeria.html") {
        document.getElementById('link-galeria')?.classList.add('active');
    } else if (pageName === "contacto.html") {
        document.getElementById('link-contacto')?.classList.add('active');
    }

    if (pageName === "servicios.html") {
        initDynamicTable();
    }

    if (pageName === "contacto.html") {
        initFormValidation();
    }
});

let cavesDataset = [
  { id: 1, name: "Cenote Dos Ojos", location: "Riviera Maya, México", maxDepth: 119, risk: "Exploración Activa", date: "2026-02-15" },
  { id: 2, name: "Orda Cave", location: "Montes Urales, Rusia", maxDepth: 200, risk: "Extremo / Restringido", date: "2025-11-08" },
  { id: 3, name: "Sac Actun", location: "Quintana Roo, México", maxDepth: 120, risk: "Exploración Activa", date: "2026-05-20" },
  { id: 4, name: "Plura Cave", location: "Mo i Rana, Noruega", maxDepth: 135, risk: "Extremo / Restringido", date: "2026-04-12" },
  { id: 5, name: "Cenote El Pit", location: "Tulum, México", maxDepth: 121, risk: "Explorado", date: "2025-08-30" }
];

function initDynamicTable() {
  renderTable(cavesDataset);
  
  const searchInput = document.getElementById('tableSearch');
  searchInput?.addEventListener('input', function(e) {
    const searchVal = e.target.value.toLowerCase().trim();
    
    const filteredData = cavesDataset.filter(cave => 
      cave.name.toLowerCase().includes(searchVal) || 
      cave.location.toLowerCase().includes(searchVal)
    );
    renderTable(filteredData);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('cavesTableBody');
  if (!tbody) return;
  tbody.innerHTML = ""; 

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No se encontraron sistemas de cuevas con esos criterios.</td></tr>`;
    return;
  }

  data.forEach(cave => {
    let badgeClass = "badge-danger-custom";
    if (cave.risk === "Explorado") {
        badgeClass = "badge-success-custom";
    } else if (cave.risk === "Exploración Activa") {
        badgeClass = "badge-warning-custom";
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${cave.name}</strong></td>
      <td><i class="fa-solid fa-location-dot text-muted me-2"></i>${cave.location}</td>
      <td><span class="tech-font text-info">${cave.maxDepth} m</span></td>
      <td><span class="badge ${badgeClass}">${cave.risk}</span></td>
      <td><span class="small text-muted">${cave.date}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteCave(${cave.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deleteCave(id) {
  if (confirm("¿Está seguro de eliminar este registro del catálogo de forma permanente?")) {
    cavesDataset = cavesDataset.filter(cave => cave.id !== id);
    renderTable(cavesDataset); // Vuelve a dibujar la tabla actualizada
  }
}

function submitNewCave() {
  const form = document.getElementById('addCaveForm');
  if (!form || !form.checkValidity()) { 
    form?.classList.add('was-validated'); 
    return; 
  }

  const newCave = {
    id: Date.now(), 
    name: document.getElementById('caveName').value,
    location: document.getElementById('caveLocation').value,
    maxDepth: parseInt(document.getElementById('caveDepth').value),
    risk: document.getElementById('caveRisk').value,
    date: document.getElementById('caveDate').value
  };

  cavesDataset.unshift(newCave);
  renderTable(cavesDataset);
  
  const modalElement = document.getElementById('addCaveModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
  
  form.reset();
  form.classList.remove('was-validated');
}

function initFormValidation() {
  const form = document.getElementById('expeditionForm');
  
  form?.addEventListener('submit', function(e) {
    e.preventDefault(); 
    let isValid = true;

    const inputName = document.getElementById('inputName');
    const inputEmail = document.getElementById('inputEmail');
    const inputDives = document.getElementById('inputDives');

    if (inputName.value.trim().length < 3) { 
        inputName.classList.add('is-invalid'); 
        isValid = false; 
    } else { 
        inputName.classList.remove('is-invalid'); 
        inputName.classList.add('is-valid'); 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value.trim())) { 
        inputEmail.classList.add('is-invalid'); 
        isValid = false; 
    } else { 
        inputEmail.classList.remove('is-invalid'); 
        inputEmail.classList.add('is-valid'); 
    }

    const divesCount = parseInt(inputDives.value);
    if (divesCount < 50 || isNaN(divesCount)) { 
        inputDives.classList.add('is-invalid'); 
        isValid = false; 
    } else { 
        inputDives.classList.remove('is-invalid'); 
        inputDives.classList.add('is-valid'); 
    }

    if (isValid) {
      alert("¡Registro exitoso! Su postulación ha sido enviada al centro de datos de DEEPDOWN.");
      form.reset();
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-valid'));
    }
  });
}

function openPhotoModal(imgUrl, title, desc) {
  document.getElementById('photoViewerImage').src = imgUrl;
  document.getElementById('photoViewerTitle').innerText = title;
  document.getElementById('photoViewerDesc').innerText = desc;
  
  const viewerModal = new bootstrap.Modal(document.getElementById('photoViewerModal'));
  viewerModal.show();
}