const body = document.body;
const form = document.querySelector('[data-form]');
const successBtn = document.querySelector('[data-btn-close]');
const errorCssClass = 'form__field--error';
const stateSuccessClass = 'state--success';

form.noValidate = true;
form.addEventListener('submit', e => {
  e.preventDefault();
  
  let invalidFields = 0;

  Array.from(form.elements).forEach(field => {
    if (!validateField(field)) {
      invalidFields++;
    }
  });

  if (invalidFields === 0) {
    body.classList.add(stateSuccessClass);
  }
});

function validateField(field) {
  const parent = field.closest('.form__field');
  
  if (!parent) return true;
  
  const errorEl = parent.querySelector('.form__field-msg');
  
  let valid = field.checkValidity();

  if (valid) {
    parent.classList.remove(errorCssClass);
    errorEl.innerHTML = '';
    return true;
  }

  parent.classList.add(errorCssClass);
  errorEl.innerHTML = getError(field);
  
  return false;
}

function getError(field) {
  if (field.validity.valueMissing) {
    return 'Please enter an email address.';
  }

  if (field.validity.typeMismatch) {
    return 'Valid email address is required.';
  }

  return 'Unknown error.';
} 

function clearStates() {
  body.classList.remove(stateSuccessClass);
}

successBtn.addEventListener('click', (e) => {
  clearStates();
});
