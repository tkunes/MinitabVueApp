<script setup lang="ts">
//import required libraries
import { ref } from 'vue'
import axios from 'axios'

//Reference to sample size value
const sampleSize = ref();
const showSampleSizeValidationError = ref(false);

//Reference to sample mean value
const sampleMean = ref();
const showSampleMeanValidationError = ref(false);

//Reference to standard dev value
const standardDev = ref();
const showStandardDevValidationError = ref(false);

//Hypothesis Test Checkbox Status
const performHypothesisTest = ref(false);
const hypothesizedMean = ref();
const showHypothesizedMeanValidationError = ref(false);

//show modal boolean for showing the results table
const showResultsModal = ref(false);

//boolean to control showing the presets error message
const showPresetsError = ref(false);

//Fetch and load preset values into the form
requestPresets();

//Functions start here
//Request presets from the server
function requestPresets()
{
  //Request preset values from server
  //Mock AJAX call using the axios library 
  axios.get('http://localhost:5173/src/assets/mock_response.json').then(loadPresets).catch(getPresetsFailure);

}

//Set form values equal to presets if present
function loadPresets(response)
{
  sampleSize.value = response.data.sample_size || "";

  sampleMean.value = response.data.sample_mean || "";

  standardDev.value = response.data.standard_deviation || "";
}

function getPresetsFailure()
{
  showPresetsError.value = true;
}



function validate()
{
  //boolean to track if all validation passed or not.
  //We want to perform all validation and show all relevant error messages for better UX
  var validationPassed = true;

  resetValidationErrorMessages();

  //Sample Size must be present, be greater than or equal to 2, and must be an integer. 
  //Note: isInteger will determine if the value is numerical or not, no need to add an additional check
  if(!sampleSize.value || sampleSize.value <= 2 || !Number.isInteger(parseFloat(sampleSize.value)))
  {
    validationPassed = false;
    showSampleSizeValidationError.value = true;
  }

  //Sample Mean must be present and must be a number
  if(!sampleMean.value || typeof sampleMean.value !== 'number')
  {
    validationPassed = false;
    showSampleMeanValidationError.value = true;
  }

  //Standard Dev must be present, must be numerical, and must be greater than 0
  if(!standardDev.value || typeof standardDev.value !== 'number' || standardDev.value <= 0)
  {
    validationPassed = false;
    showStandardDevValidationError.value = true;
  }

  if(performHypothesisTest.value && (!hypothesizedMean.value || typeof hypothesizedMean.value !== 'number'))
  {
    validationPassed = false;
    showHypothesizedMeanValidationError.value = true;
  }

  //if all validation steps have passed, submit the form
  if(validationPassed)
  {
    submit();
  }

}

//Reset all validation error messages
function resetValidationErrorMessages()
{
  showSampleSizeValidationError.value       = false;
  showSampleMeanValidationError.value       = false;
  showStandardDevValidationError.value      = false;
  showHypothesizedMeanValidationError.value = false;
}

//TODO: submit function 
function submit()
{
  showResultsModal.value = true;
}

//close the modal
function closeModal()
{
  showResultsModal.value = false;
}

//reset the form to default values
function reset()
{

  //re-request the presets. 
  //they are not cached in the browser and could have potentially changed on the server side since last request
  requestPresets();

  //reset the hypothesis checkbox
  performHypothesisTest.value = false;
  hypothesizedMean.value = '';

  //reset any validation error messages that are showing
  resetValidationErrorMessages();

}

//reset hypothesis mean value
//checking the box will clear it before it becomes enabled
//unchecking the box will clear it when it becomes disabled
function resetHypothesizedMean()
{
  hypothesizedMean.value = "";
}

</script>
<template>
<!-- Main Form -->
<div id="app">
  <div v-if="showPresetsError" class="presets-error-message">
    <p>Error Retrieving Presets from Server </p>
  </div>
  <div class="sample-size-input input-row">
    <label>Sample Size : </label>
    <input v-model="sampleSize" class="number-input" type="number" placeholder="Type here"/>
    <div v-if="showSampleSizeValidationError" class="error-message">Please enter an Integer equal or greater than 2.</div>
    <br>
  </div>
  <div class="sample-mean-input input-row">
    <label>Sample Mean : </label>
    <input v-model="sampleMean" class="number-input" type="number" placeholder="Type here"/>
    <div v-if="showSampleMeanValidationError" class="error-message">Please enter a numerical value.</div>
    <br>
  </div>
  <div class="standard-dev-input input-row">
    <label>Standard Deviation : </label>
    <input v-model="standardDev" class="number-input" type="number" placeholder="Type here"/>
    <p v-if="showStandardDevValidationError" class="error-message">Please enter a numerical value greater than 0.</p>
    <br>
  </div>
  <div class="hypothesis-check-input input-row">
    <input type="checkbox" id="hypothesis-test" class="hypothesis-test" v-model="performHypothesisTest" @click="resetHypothesizedMean"/>
    <label for="hypothesis-test" class="hyopthesis-label">Perform Hypothesis test</label>
    <div class="hypothesized-mean">
      <label class="hypo-mean-label">Hypothesized Mean : </label>
      <input v-model="hypothesizedMean" class="number-input" type="number" placeholder="Type here" :disabled="!performHypothesisTest"/>
      <p v-if="showHypothesizedMeanValidationError" class="error-message">Please enter a numerical value.</p>
      <br>
    </div>
  </div>
  <div>
    <button class="ok-button" @click="validate">OK</button>
    <button class="reset-button" @click="reset">Reset</button>
  </div>
</div>

<!-- Results Modal -->
<Transition name="modal">
    <div v-if="showResultsModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="results-table">
            <div>
              <p class="sample-size-result"> Sample Size : {{ sampleSize }}</p>
              <p class="sample-mean-result"> Sample Mean : {{ sampleMean }}</p>
              <p class="standard-dev-result"> Standard Deviation : {{ standardDev }}</p>
              <div v-if="!performHypothesisTest">Hypothesis Test not enabled</div>
              <div v-else class="hypothesized-mean-result">
                <p>Hypothesized Mean : {{ hypothesizedMean }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button
                class="modal-default-button"
                @click="closeModal"
              >OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

#app {
  display: block;
  width: 500px;
}

.hyopthesis-label {
  padding-left: 5px;
}

.hypo-mean-label {
  padding-left: 20%;
}
.input-row {
  width: 100%;
  padding-block: 5px;
}

.number-input {
  float: right;
}

.ok-button {
  background-color:blue;
  color:white;
}

.reset-button {

}
.error-message {
  color: red;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

/* Personal perference to remove the arrows in the number input boxes */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

/* Modal CSS */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
/* End Modal */

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
