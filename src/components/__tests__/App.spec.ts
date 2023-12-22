import { mount } from '@vue/test-utils'
import { it, expect } from 'vitest'
import App from '../../App.vue';

//Mount the app to the DOM
const wrapper = mount(App);

//Test the request presets functionality
it('Request Presets Validation', async() => 
{

    //call the request presets function to set the form values to test
    await wrapper.vm.requestPresets();

    //cast the elements as input elements to the compiler doesn't complain
    const sampleSizeInputElement  = wrapper.find('.sample-size').element as HTMLInputElement;
    const sampleMeanInputElement  = wrapper.find('.sample-mean').element as HTMLInputElement;
    const standardDevInputElement = wrapper.find('.standard-dev').element as HTMLInputElement;

    //validate against the json values
    expect(sampleSizeInputElement.value).toBe('10');
    expect(sampleMeanInputElement.value).toBe('2.5');
    expect(standardDevInputElement.value).toBe('0.1');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');
});

//Test to make sure that the results pop up appears in the DOM with the appropriate values
it('Results Popup Validation', async() => 
{
    //call the request presets function to set the form values to test
    await wrapper.vm.requestPresets();

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //the pop up should now be loaded into the DOM with the form values
    //check the pop up values 
    expect(wrapper.text()).toContain('Sample Size : 10');
    expect(wrapper.text()).toContain('Sample Mean : 2.5');
    expect(wrapper.text()).toContain('Standard Deviation : 0.1');

    //click the ok button
    //dismiss the popup
    await wrapper.get('.pop-up-ok-button').trigger('click');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');
});

//Test the sample size validation functionality
//Sample size must be:
// * present
// * a whole number
// greater than or equal to 2
it('Sample Size Validation', async() => 
{

    //get a reference to the sample size input
    const sampleSizeInput = wrapper.find('.sample-size');

    //set the sample size input to nothing
    await sampleSizeInput.setValue(' ');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter an Integer equal or greater than 2.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter an Integer equal or greater than 2.');

    //set the sample size input to an unacceptable whole number
    await sampleSizeInput.setValue(1);

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter an Integer equal or greater than 2.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter an Integer equal or greater than 2.');

    //set the sample size input to an unacceptable double value
    await sampleSizeInput.setValue(4.50);

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter an Integer equal or greater than 2.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter an Integer equal or greater than 2.');

    //set the sample size input to an acceptable value
    await sampleSizeInput.setValue(10);

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter an Integer equal or greater than 2.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter an Integer equal or greater than 2.');
});

//Sample Mean must be:
// * present
// * a numerical value
it('Sample Mean Validation', async() => 
{

    //get a reference to the sample mean input
    const sampleMeanInput = wrapper.find('.sample-mean');

    //set the sample mean input to nothing
    await sampleMeanInput.setValue('');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //set the sample mean input to an unacceptable whole number
    await sampleMeanInput.setValue('foo');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //set the sample mean input to an acceptable number
    await sampleMeanInput.setValue('4');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. this will also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');
});

//Standard Deviation must be:
// * present
// * a numerical value
// * greater than 0
it('Standard Deviation Validation', async() => 
{
    //get a reference to the standard dev input
    const standardDevInput = wrapper.find('.standard-dev');

    //set the standard dev input to nothing
    await standardDevInput.setValue('');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value greater than 0.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value greater than 0.');

    //set the standard dev input to an unacceptable whole number
    await standardDevInput.setValue('foo');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value greater than 0.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value greater than 0.');

    //set the standard dev input to a negative number
    await standardDevInput.setValue('-1');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value greater than 0.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value greater than 0.');

    //set the standard dev input to an acceptable number
    await standardDevInput.setValue('4');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter a numerical value greater than 0.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset. also test that the reset button works
    expect(wrapper.text()).not.toContain('Please enter a numerical value greater than 0.');
});


//Hypothesized Mean :
// * can only be entered if the checkbox is enabled
// * must be present if the checkbox is enabled
// * must be a numerical value
it('Hypothesized Mean Validation', async() => 
{
    //get a reference to the hypothesized mean input
    const hypothesizedMeanInput = wrapper.find('.hypothesized-mean-input');
    //get a reference to othe hypothesized mean test checkbox
    const hypothesizedMeanCheckbox = wrapper.find('.hypothesis-test');

    //call the request presets function to set the form values to test
    await wrapper.vm.requestPresets();

    //submit the form with default values to verify that the hypothesized mean not enabled statement shows correctly
    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the hypothesized mean not enabled statement shows
    expect(wrapper.text()).toContain('Hypothesis Test not enabled');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //check the checkbox, this should enable the hypothesized mean input
    await hypothesizedMeanCheckbox.setValue(true);

    //wait a tick for the dom to update
    await wrapper.vm.$nextTick();

    //verify that the hypothesized mean input is enabled
    expect(hypothesizedMeanInput.attributes().disabled).not.toBeDefined()

    //set the hypothesized mean input to nothing
    await hypothesizedMeanInput.setValue('');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //check the checkbox, this should enable the hypothesized mean input
    await hypothesizedMeanCheckbox.setValue(true);

    //wait a tick for the dom to update
    await wrapper.vm.$nextTick();

    //verify that the hypothesized mean input is enabled
    expect(hypothesizedMeanInput.attributes().disabled).not.toBeDefined()

    //set the hypothesized mean input to a string
    await hypothesizedMeanInput.setValue('foo');

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message shows up
    expect(wrapper.text()).toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //check the checkbox, this should enable the hypothesized mean input
    await hypothesizedMeanCheckbox.setValue(true);

    //wait a tick for the dom to update
    await wrapper.vm.$nextTick();

    //verify that the hypothesized mean input is enabled
    expect(hypothesizedMeanInput.attributes().disabled).not.toBeDefined()

    //set the hypothesized mean input to an acceptable number
    await hypothesizedMeanInput.setValue(6);

    //click the submit button
    await wrapper.get('.ok-button').trigger('click');

    //verify that the error message does NOT show up
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');

    //reset the form
    await wrapper.get('.reset-button').trigger('click');

    //verify that the form is reset.
    expect(wrapper.text()).not.toContain('Please enter a numerical value.');
});