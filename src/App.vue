<script setup lang="ts">

//import required libraries
import { ref } from 'vue'
import axios from 'axios'

//Reference to sample size input
const sampleSize = ref();
//Boolean to control showing the sample size validation error
const showSampleSizeValidationError = ref(false);

//Reference to sample mean input
const sampleMean = ref();
//Boolean to control showing the sample mean validation error
const showSampleMeanValidationError = ref(false);

//Reference to standard dev input
const standardDev = ref();
//Boolean to control showing the standard deviation validation error
const showStandardDevValidationError = ref(false);

//Reference to the Hypothesis Test Checkbox
const performHypothesisTest = ref(false);

//Reference to the hypothesized mean input
const hypothesizedMean = ref();
//Boolean to control showing the sample size validation error
const showHypothesizedMeanValidationError = ref(false);

//show modal boolean for showing the results modal
const showResultsModal = ref(false);

//boolean to control showing the presets error message
const showPresetsError = ref(false);

//Fetch and load preset values into the forms
requestPresets();

//Form Functions

//Request presets from the server
//this is async for the unit tests
async function requestPresets()
{
  //Request preset values from server
  //Mock AJAX call using the axios library 
  try
  {
    let response = await axios.get('http://localhost:5173/mock_response.json')
    
    //load the response data into the form
    loadPresets(response);
  }
  catch(e)
  {
    getPresetsFailureHandler(e);
  }
}

//Set form values equal to presets if present
function loadPresets(response: {data:{sample_size?:number, sample_mean?:number, standard_deviation?:number}})
{

  //we're expecting data to be an object, if its not, we can't load anything into the form 
  if(typeof response != 'object' || typeof response.data != 'object')
  {
    getPresetsFailureHandler(response.data);
    return;
  }

  sampleSize.value = response.data.sample_size || "";

  sampleMean.value = response.data.sample_mean || "";

  standardDev.value = response.data.standard_deviation || "";
  return;
}

//error handler for requesting presets
function getPresetsFailureHandler(e:any)
{
  //log the error
  console.log(e);
  //show the error message in the UI
  showPresetsError.value = true;
}

//Validates the inputs before calling the submit function
function validate()
{
  //boolean to track if all validation passed or not.
  //We want to perform all validation and show all relevant error messages for better UX
  var validationPassed = true;

  //clear any existing error messages
  resetValidationErrorMessages();

  //Sample Size must be present, be greater than or equal to 2, and must be an integer.
  if(!sampleSize.value || sampleSize.value < 2 || typeof sampleSize.value !== 'number' || !Number.isInteger(sampleSize.value))
  {
    validationPassed = false;
    showSampleSizeValidationError.value = true;
  }

  //Sample Mean must be present and must be a number
  //Extra check here because a value of 0 will trigger a false positive
  if((!sampleMean.value && sampleMean.value !== 0) || typeof sampleMean.value !== 'number')
  {
    validationPassed = false;
    showSampleMeanValidationError.value = true;
  }

  //Standard Dev must be present, must be numerical, and must be greater than 0
  if(!standardDev.value || typeof standardDev.value !== 'number' || standardDev.value < 0)
  {
    validationPassed = false;
    showStandardDevValidationError.value = true;
  }

  //if the perform hypothesis test checkbox is checked, then make sure the hypo mean is entered and is a number
  //Extra check here because a value of 0 will trigger a false positive
  if(performHypothesisTest.value && ((!hypothesizedMean.value && hypothesizedMean.value !==0) || typeof hypothesizedMean.value !== 'number'))
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
  showPresetsError.value                    = false;
}
//Submit function that enabled the results modal window
function submit()
{
  showResultsModal.value = true;
}

//close the results modal
function closeResultsModal()
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

//expose functions for the testing framework to call
defineExpose({requestPresets, loadPresets, getPresetsFailureHandler});

</script>
<template>
<!-- Main Form -->
<div id="app">
  <div v-if="showPresetsError" class="presets-error-message error-message">
    <p>Error Retrieving Presets from Server </p>
  </div>
  <div class="sample-size-input input-row">
    <label>Sample Size : </label>
    <input v-model="sampleSize" class="sample-size number-input" type="number"/>
    <div v-if="showSampleSizeValidationError" class="error-message">Please enter an Integer equal or greater than 2.</div>
    <br>
  </div>
  <div class="sample-mean-input input-row">
    <label>Sample Mean : </label>
    <input v-model="sampleMean" class="sample-mean number-input" type="number"/>
    <div v-if="showSampleMeanValidationError" class="error-message">Please enter a numerical value.</div>
    <br>
  </div>
  <div class="standard-dev-input input-row">
    <label>Standard Deviation : </label>
    <input v-model="standardDev" class="standard-dev number-input" type="number"/>
    <p v-if="showStandardDevValidationError" class="error-message">Please enter a numerical value greater than 0.</p>
    <br>
  </div>
  <div class="hypothesis-check-input input-row">
    <input type="checkbox" id="hypothesis-test" class="hypothesis-test" v-model="performHypothesisTest" @click="resetHypothesizedMean"/>
    <label for="hypothesis-test" class="hyopthesis-label">Perform Hypothesis test</label>
    <div class="hypothesized-mean">
      <label class="hypo-mean-label">Hypothesized Mean : </label>
      <input v-model="hypothesizedMean" class="hypothesized-mean-input number-input" type="number" :disabled="!performHypothesisTest"/>
      <p v-if="showHypothesizedMeanValidationError" class="error-message">Please enter a numerical value.</p>
      <br>
    </div>
  </div>
  <div class="button-div">
    <button class="ok-button button" @click="validate">OK</button>
    <button class="reset-button button" @click="reset">Reset</button>
  </div>
</div>

<!-- Results Modal -->
<Transition name="modal">
    <div v-if="showResultsModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="results-table">
            <div>
              <p class="sample-size-result result-text"> Sample Size : {{ sampleSize }}</p>
              <p class="sample-mean-result result-text"> Sample Mean : {{ sampleMean }}</p>
              <p class="standard-dev-result result-text"> Standard Deviation : {{ standardDev }}</p>
              <div v-if="!performHypothesisTest" class="result-text">Hypothesis Test not enabled</div>
              <div v-else class="hypothesized-mean-result result-text">
                <p>Hypothesized Mean : {{ hypothesizedMean }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
              <button class="modal-default-button button ok-button pop-up-ok-button" @click="closeResultsModal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Main App CSS */
#app {
  display: block;
  width: 500px;
  position: absolute;
  top: 5%;
  left: 5%;
}
.hyopthesis-label {
  padding-left: 5px;
}
.hypo-mean-label {
  padding-left: 20%;
}
.input-row {
  width: 100%;
  height: 55px;
  padding-block: 5px;
}
.number-input {
  float: right;
}
.button-div {
  padding-top: 20px;
  float:right;
}
.button {
  border-radius: 4px;
  text-align: center;
  width: 80px;
  height: 30px;
}
.ok-button {
  background-color:#2865A8;
  color:white;
  border: none;
  
}
.reset-button {
  background-color: white;
  border-width: 1px;
  border-color: gray;
  margin-left: 10px;

}
.error-message {
  color: red;
  float: right;
}

/* Personal perference to remove the arrows in the number input boxes */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox css to remove arrows in the number boxes */
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
  width: 350px;
  height: 175px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-default-button {
  float: right;
  margin-bottom: 10px;
}
.modal-footer {
  padding-block: 10px;;
}
.result-text {
  color:black;
}
/* End Modal */
</style>