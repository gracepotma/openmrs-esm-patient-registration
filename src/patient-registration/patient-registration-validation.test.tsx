import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { validationSchema } from './patient-registration-validation';
import { NameInput } from './input/custom-input/name-input.component';
import { SelectInput } from './input/basic-input/select-input.component';
import { TelephoneNumberInput } from './input/basic-input/telephone-number-input/telephone-number-input.component';

describe('name input', () => {
  const testValidName = (givenNameValue: string, middleNameValue: string, familyNameValue: string) => {
    it('does not display error message when givenNameValue: ' + givenNameValue + ', middleNameValue: ' + middleNameValue + ', familyNameValue: ' + familyNameValue, async () => {
      const error = await updateNameAndReturnError(givenNameValue, middleNameValue, familyNameValue);
      Object.values(error).map(currentError => expect(currentError).toBeNull());
    });
  };

  const testInvalidName = (givenNameValue: string, middleNameValue: string, familyNameValue: string, expectedError: string, errorType: string) => {
    it('displays error message when givenNameValue: ' + givenNameValue + ', middleNameValue: ' + middleNameValue + ', familyNameValue: ' + familyNameValue, async () => {
      const error = (await updateNameAndReturnError(givenNameValue, middleNameValue, familyNameValue))[errorType];
      expect(error.textContent).toEqual(expectedError);
    });
  };

  const updateNameAndReturnError = async (givenNameValue: string, middleNameValue: string, familyNameValue: string) => {
    const { container, getByLabelText } = render(
      <Formik initialValues={{
        givenName: '',
        middleName: '',
        familyName: '',
      }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <NameInput givenName="givenName" middleName="middleName" familyName="familyName" />
        </Form>
      </Formik>,
    );
    const givenNameInput = getByLabelText('Given Name') as HTMLInputElement;
    const middleNameInput = getByLabelText('Middle Name') as HTMLInputElement;
    const familyNameInput = getByLabelText('Family Name') as HTMLInputElement;

    fireEvent.change(givenNameInput, { target: { value: givenNameValue } });
    fireEvent.blur(givenNameInput);
    fireEvent.change(middleNameInput, { target: { value: middleNameValue } });
    fireEvent.blur(middleNameInput);
    fireEvent.change(familyNameInput, { target: { value: familyNameValue } });
    fireEvent.blur(familyNameInput);

    await wait();

    return {
      givenNameError: container.querySelector('div[aria-label="givenNameError"]'),
      middleNameError: container.querySelector('div[aria-label="middleNameError"]'),
      familyNameError: container.querySelector('div[aria-label="familyNameError"]'),
    };
  };

  testValidName('Aaron', 'A', 'Aaronson');
  testValidName('No', '', 'Middle Name');
  testInvalidName('', '', '', 'Given name is required', 'givenNameError');
  testInvalidName('', '', '', 'Family name is required', 'familyNameError');
  testInvalidName('', 'No', 'Given Name', 'Given name is required', 'givenNameError');
  testInvalidName('No', 'Family Name', '', 'Family name is required', 'familyNameError');
});

describe('gender input', () => {
  const testValidGender = (validGender: string) => {
    it('does not display error message when ' + validGender + ' is inputted', async () => {
      const error = await updateGenderAndReturnError(validGender);
      expect(error).toBeNull();
    });
  };

  const testInvalidGender = (invalidGender: string, expectedError: string) => {
    it('displays error message when ' + invalidGender + ' is inputted', async () => {
      const error = await updateGenderAndReturnError(invalidGender);
      expect(error.textContent).toEqual(expectedError);
    });
  };

  const updateGenderAndReturnError = async (gender: string) => {
    const { container, getByLabelText } = render(
      <Formik initialValues={{ gender: '' }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <SelectInput name="gender" options={['Male', 'Female', 'Other', 'Unknown']} />
        </Form>
      </Formik>,
    );
    const input = getByLabelText('gender') as HTMLSelectElement;

    fireEvent.change(input, { target: { value: gender } });
    fireEvent.blur(input);

    await wait();

    return container.querySelector('div[aria-label="genderError"]');
  };

  testValidGender('M');
  testValidGender('F');
  testValidGender('O');
  testValidGender('U');
  testInvalidGender('', 'Gender is required');
});

describe('telephone number input', () => {
  const testValidTelephoneNumber = (validNumber: string) => {
    it('does not display error message when ' + validNumber + ' is inputted', async () => {
      const error = await updateTelephoneNumberAndReturnError(validNumber);
      expect(error).toBeNull();
    });
  };

  const testInvalidTelephoneNumber = (invalidNumber: string) => {
    it('displays error message when ' + invalidNumber + ' is inputted', async () => {
      const error = await updateTelephoneNumberAndReturnError(invalidNumber);
      expect(error.textContent).toEqual('Telephone number should only contain digits');
    });
  };

  const updateTelephoneNumberAndReturnError = async (number: string) => {
    const { container, getByLabelText } = render(
      <Formik initialValues={{ telephoneNumber: '' }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <TelephoneNumberInput label="" placeholder="Enter telephone number" name="telephoneNumber" />
        </Form>
      </Formik>,
    );
    const input = getByLabelText('telephoneNumber') as HTMLInputElement;

    fireEvent.change(input, { target: { value: number } });
    fireEvent.blur(input);

    await wait();

    return container.querySelector('div[aria-label="telephoneNumberError"]');
  };

  testValidTelephoneNumber('0800001066');
  testInvalidTelephoneNumber('not a phone number');
  testInvalidTelephoneNumber('+0800001066');
  testInvalidTelephoneNumber('(0800)001066');
});
