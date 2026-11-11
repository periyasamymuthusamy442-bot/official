/**
 * STUZEN TECHNOLOGIES — Interactive Requirements Discovery Form Script
 * Digitization of the Stuzen 11-Page Client Interview Questionnaire
 */

document.addEventListener('DOMContentLoaded', () => {
  initDiscoveryForm();
});

const TOTAL_STEPS = 10;
let currentStep = 1;

function initDiscoveryForm() {
  const form = document.getElementById('discoveryForm');
  if (!form) return;

  setupStepTabs();
  setupOptionTiles();
  setupStepNavButtons();
  loadSavedState();
  updateStepView(1);
  setupSummaryGenerators();

  // Recalculate estimates on any change
  form.addEventListener('change', () => {
    saveState();
    calculateEstimates();
  });
}

/* --------------------------------------------------------------------------
   1. Step Navigation & Progress
   -------------------------------------------------------------------------- */
function setupStepTabs() {
  const tabs = document.querySelectorAll('.discovery-step-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.getAttribute('data-step'), 10);
      if (step) {
        goToStep(step);
      }
    });
  });
}

function setupStepNavButtons() {
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < TOTAL_STEPS) {
          goToStep(currentStep + 1);
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });
}

function goToStep(step) {
  currentStep = step;
  updateStepView(step);
  window.scrollTo({ top: document.querySelector('.discovery-container').offsetTop - 90, behavior: 'smooth' });
}

function updateStepView(step) {
  // Update panes
  document.querySelectorAll('.discovery-step-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  const activePane = document.getElementById(`stepPane${step}`);
  if (activePane) activePane.classList.add('active');

  // Update tabs
  document.querySelectorAll('.discovery-step-tab').forEach(tab => {
    const tabStep = parseInt(tab.getAttribute('data-step'), 10);
    tab.classList.remove('active');
    if (tabStep === step) {
      tab.classList.add('active');
    } else if (tabStep < step) {
      tab.classList.add('completed');
    }
  });

  // Update progress bar
  const progressFill = document.querySelector('.discovery-progress-fill');
  if (progressFill) {
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    progressFill.style.width = `${pct}%`;
  }

  // If on final review step, refresh summary and estimates
  if (step === TOTAL_STEPS) {
    refreshSummaryReview();
    calculateEstimates();
  }
}

function validateStep(step) {
  if (step === 1) {
    const clientName = document.getElementById('q1_clientName')?.value.trim();
    const brandName = document.getElementById('q2_brandName')?.value.trim();
    if (!clientName || !brandName) {
      alert('Please fill in your Name and Brand/Business Name to proceed.');
      return false;
    }
  }
  return true;
}

/* --------------------------------------------------------------------------
   2. Interactive Option Tiles (Checkboxes and Radios)
   -------------------------------------------------------------------------- */
function setupOptionTiles() {
  const tiles = document.querySelectorAll('.option-tile');
  tiles.forEach(tile => {
    const input = tile.querySelector('input');
    if (!input) return;

    // Set initial selected state
    if (input.checked) tile.classList.add('selected');

    // The tile is a <label>, so the browser already toggles the input on click.
    // (A manual toggle here would flip it twice and cancel out.)

    input.addEventListener('change', () => {
      if (input.type === 'radio') {
        const name = input.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          r.closest('.option-tile')?.classList.remove('selected');
        });
        if (input.checked) tile.classList.add('selected');
      } else {
        tile.classList.toggle('selected', input.checked);
      }
      saveState();
      calculateEstimates();
    });
  });
}

/* --------------------------------------------------------------------------
   3. Auto-save & LocalStorage
   -------------------------------------------------------------------------- */
function saveState() {
  const form = document.getElementById('discoveryForm');
  if (!form) return;

  const data = {};
  const formData = new FormData(form);
  
  for (let [key, val] of formData.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(val);
    } else {
      data[key] = val;
    }
  }

  localStorage.setItem('stuzen_discovery_data', JSON.stringify(data));
}

function loadSavedState() {
  const saved = localStorage.getItem('stuzen_discovery_data');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    const form = document.getElementById('discoveryForm');
    if (!form) return;

    for (let key in data) {
      const val = data[key];
      const elements = form.querySelectorAll(`[name="${key}"]`);

      elements.forEach(el => {
        if (el.type === 'checkbox') {
          if (Array.isArray(val)) {
            el.checked = val.includes(el.value);
          } else {
            el.checked = (el.value === val);
          }
          el.closest('.option-tile')?.classList.toggle('selected', el.checked);
        } else if (el.type === 'radio') {
          el.checked = (el.value === val);
          el.closest('.option-tile')?.classList.toggle('selected', el.checked);
        } else {
          el.value = val;
        }
      });
    }
  } catch (err) {
    console.error('Error loading saved discovery form state', err);
  }
}

/* --------------------------------------------------------------------------
   4. Live Project Cost & Timeline Estimation Engine
   -------------------------------------------------------------------------- */
function calculateEstimates() {
  let basePrice = 450;
  let baseWeeks = 2;

  // Website Type
  const siteType = document.querySelector('input[name="q12_siteType"]:checked')?.value;
  if (siteType === 'ecommerce') { basePrice += 400; baseWeeks += 2; }
  else if (siteType === 'portal') { basePrice += 700; baseWeeks += 3; }
  else if (siteType === 'service') { basePrice += 150; baseWeeks += 1; }
  else if (siteType === 'booking') { basePrice += 250; baseWeeks += 1; }

  // Count checked pages
  const pagesChecked = document.querySelectorAll('input[name="q13_pages"]:checked').length;
  if (pagesChecked > 5) {
    basePrice += (pagesChecked - 5) * 50;
    if (pagesChecked > 8) baseWeeks += 1;
  }

  // Count features
  const features = document.querySelectorAll('input[name="q22_features"]:checked');
  features.forEach(f => {
    const val = f.value;
    if (val === 'payment') { basePrice += 150; }
    if (val === 'booking') { basePrice += 120; }
    if (val === 'chat' || val === 'whatsapp') { basePrice += 60; }
    if (val === 'login' || val === 'admin') { basePrice += 200; baseWeeks += 1; }
    if (val === 'cart') { basePrice += 180; }
    if (val === 'multilang') { basePrice += 100; }
  });

  // Integrations
  const integrations = document.querySelectorAll('input[name="q26_whatsapp"]:checked');
  if (integrations.length >= 3) {
    basePrice += 150;
  }

  const estPriceEl = document.getElementById('estProjectCost');
  const estTimelineEl = document.getElementById('estProjectTimeline');

  if (estPriceEl) estPriceEl.textContent = `$${basePrice.toLocaleString()}+`;
  if (estTimelineEl) estTimelineEl.textContent = `${baseWeeks}-${baseWeeks + 2} Weeks`;
}

/* --------------------------------------------------------------------------
   5. Summary & Review Generator
   -------------------------------------------------------------------------- */
function refreshSummaryReview() {
  const getVal = (id) => document.getElementById(id)?.value.trim() || '—';
  const getCheckedLabels = (name) => {
    const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (!checked.length) return 'None specified';
    return Array.from(checked).map(c => c.closest('.option-tile')?.querySelector('.tile-title')?.textContent.trim() || c.value).join(', ');
  };

  const setSummaryText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setSummaryText('summaryClientName', getVal('q1_clientName'));
  setSummaryText('summaryBrandName', getVal('q2_brandName'));
  setSummaryText('summaryIndustry', getVal('q3_industry'));
  setSummaryText('summaryContact', `${getVal('q4_contact')} / ${getVal('q4_email')}`);
  setSummaryText('summaryPurpose', getCheckedLabels('q8_purpose'));
  setSummaryText('summarySiteType', getCheckedLabels('q12_siteType'));
  setSummaryText('summaryPages', getCheckedLabels('q13_pages'));
  setSummaryText('summaryDesignStyle', getCheckedLabels('q18_designStyle'));
  setSummaryText('summaryFeatures', getCheckedLabels('q22_features'));
  setSummaryText('summaryWhatsApp', getCheckedLabels('q26_whatsapp'));
  setSummaryText('summaryBudget', getCheckedLabels('q41_budget'));
  setSummaryText('summaryDeadline', getVal('q39_deadline'));
}

/* --------------------------------------------------------------------------
   6. Export Actions: WhatsApp, PDF, JSON Brief
   -------------------------------------------------------------------------- */
function setupSummaryGenerators() {
  // WhatsApp Export
  const whatsappBtn = document.getElementById('btnExportWhatsApp');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const clientName = document.getElementById('q1_clientName')?.value.trim() || 'Client';
      const brand = document.getElementById('q2_brandName')?.value.trim() || 'My Business';
      const siteType = document.querySelector('input[name="q12_siteType"]:checked')?.value || 'Website';
      const budget = document.querySelector('input[name="q41_budget"]:checked')?.value || 'To be discussed';
      const phone = document.getElementById('q4_contact')?.value.trim() || '';

      const summaryText = `*NEW PROJECT DISCOVERY BRIEF — STUZEN TECHNOLOGIES*%0A%0A` +
        `*Client:* ${clientName}%0A` +
        `*Brand / Company:* ${brand}%0A` +
        `*Phone/WhatsApp:* ${phone}%0A` +
        `*Website Type:* ${siteType}%0A` +
        `*Budget Range:* ${budget}%0A%0A` +
        `I have completed the Stuzen Requirements Discovery Form online. Please review my project specifications and get back to me!`;

      // Official Stuzen WhatsApp contact
      const stuzenWhatsAppNumber = '919876543210';
      const url = `https://wa.me/${stuzenWhatsAppNumber}?text=${summaryText}`;
      window.open(url, '_blank');
    });
  }

  // Print / Save PDF
  const printBtn = document.getElementById('btnPrintDiscovery');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Download Brief JSON
  const downloadBtn = document.getElementById('btnDownloadBrief');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const saved = localStorage.getItem('stuzen_discovery_data') || '{}';
      const blob = new Blob([saved], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Stuzen_Discovery_Brief_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (typeof showToast === 'function') {
        showToast('Project brief downloaded successfully!');
      }
    });
  }

  // Reset Form
  const resetBtn = document.getElementById('btnResetForm');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all answers in the Discovery Form?')) {
        localStorage.removeItem('stuzen_discovery_data');
        document.getElementById('discoveryForm')?.reset();
        document.querySelectorAll('.option-tile').forEach(t => t.classList.remove('selected'));
        goToStep(1);
        calculateEstimates();
        if (typeof showToast === 'function') {
          showToast('Discovery form cleared');
        }
      }
    });
  }
}

