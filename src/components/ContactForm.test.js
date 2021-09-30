import React from "react";
import {
  render,
  screen,
  waitFor,
  queryByText,
  wait
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  //select the header for the form by text
  const formHeader = screen.queryByText(/contact form/i);
  //should be in the doc, should have text 'contact form'
  expect(formHeader).toBeInTheDocument();
  expect(formHeader).toHaveTextContent(/contact form/i);
  expect(formHeader).toBeTruthy();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstName = screen.queryByPlaceholderText(/edd/i);
  userEvent.type(firstName, "Kris");
  await waitFor(() => {
    const errorMessage = screen.queryByText(
      /error: firstname must have at least 5 characters./i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  //can just click the button and it should render ALL error messages
  const button = screen.queryByRole("button");
  userEvent.click(button);
  //   const firstName = screen.queryByPlaceholderText(/edd/i);
  //   const lastName = screen.queryByPlaceholderText(/burke/i);
  //   const email = screen.queryByPlaceholderText(/bluebill1049@hotmail.com/i);
  //   userEvent.type(firstName, "");
  //   userEvent.type(lastName, "");
  //   userEvent.type(email, "");

  await waitFor(() => {
    //test that a specfic error is on screen
    //test that all errors are on screen
    const firstNameError = screen.queryByText(
      /error: firstname must have at least 5 characters./i
    );
    const lastNameError = screen.queryByText(
      /error: lastname is a required field./i
    );
    const emailError = screen.queryByText(
      /error: email must be a valid email address./i
    );
    const errors = screen.queryAllByTestId(/error/i);

    expect(firstNameError).toBeInTheDocument();
    expect(firstNameError).toHaveTextContent(
      /error: firstname must have at least 5 characters./i
    );
    expect(lastNameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();

    expect(errors).toBeTruthy();
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstName = screen.queryByPlaceholderText(/edd/i);
  const lastName = screen.queryByPlaceholderText(/burke/i);
  userEvent.type(firstName, "Kristian");
  userEvent.type(lastName, "Fulkerson");
  const button = screen.queryByRole("button");
  userEvent.click(button);
  await waitFor(() => {
    const emailError = screen.queryByText(
      /error: email must be a valid email address./i
    );
    const testSecondError = screen.queryByText(
      /error: firstname must have at least 5 characters./i
    );
    expect(testSecondError).not.toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(emailError).toHaveTextContent(
      /error: email must be a valid email address./i
    );
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const email = screen.queryByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(email, "s");

  await waitFor(() => {
    const emailError = screen.queryByText(
      /error: email must be a valid email address./i
    );
    expect(emailError).toBeTruthy();
    expect(emailError).toBeInTheDocument();
    expect(emailError).toHaveTextContent(
      /error: email must be a valid email address./i
    );
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const firstName = screen.queryByPlaceholderText(/edd/i);
  const lastName = screen.queryByPlaceholderText(/burke/i);
  const email = screen.queryByPlaceholderText(/bluebill1049@hotmail.com/i);
  const button = screen.queryByRole("button");
  userEvent.type(firstName, "Kristian");
  userEvent.type(lastName, "");
  userEvent.type(email, "thisistheguy451@gmail.com");
  userEvent.click(button);

  await waitFor(() => {
    const lastNameError = screen.queryByText(
      /error: lastname is a required field./i
    );
    expect(lastNameError).toHaveTextContent(
      /error: lastname is a required field./i
    );
    expect(lastNameError).toBeTruthy();
    expect(lastNameError).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name*/i);
  const lastName = screen.getByLabelText(/last name*/i);
  const email = screen.getByLabelText(/email*/i);

  userEvent.type(firstName, "kristian");
  userEvent.type(lastName, "fulkerson");
  userEvent.type(email, "thisguy451@gmail.com");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const firstNameShows = screen.queryByText("kristian");
    const lastNameShows = screen.queryByText("fulkerson");
    const emailShows = screen.queryByText("thisguy451@gmail.com");
    const messageShows = screen.queryByTestId("messageDisplay");
    expect(firstNameShows).toBeInTheDocument();
    expect(lastNameShows).toBeInTheDocument();
    expect(emailShows).toBeInTheDocument();
    expect(messageShows).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstName = screen.queryByPlaceholderText(/edd/i);
  const lastName = screen.queryByPlaceholderText(/burke/i);
  const email = screen.queryByPlaceholderText(/bluebill1049@hotmail.com/i);
  const button = screen.queryByRole("button");
  userEvent.type(firstName, "Kristian");
  userEvent.type(lastName, "");
  userEvent.type(email, "thisistheguy451@gmail.com");
  userEvent.click(button);

  await waitFor(() => {
    const lastNameError = screen.queryByText(
      /error: lastname is a required field./i
    );
    expect(lastNameError).toHaveTextContent(
      /error: lastname is a required field./i
    );
    expect(lastNameError).toBeTruthy();
    expect(lastNameError).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name*/i);
  const lastName = screen.getByLabelText(/last name*/i);
  const email = screen.getByLabelText(/email*/i);
  const message = screen.getByLabelText(/message/i);

  userEvent.type(firstName, "kristian");
  userEvent.type(lastName, "fulkerson");
  userEvent.type(email, "thisguy451@gmail.com");
  userEvent.type(message, "my first message");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const firstNameShows = screen.queryByTestId("firstnameDisplay");
    const lastNameShows = screen.queryByTestId("lastnameDisplay");
    const emailShows = screen.queryByTestId("emailDisplay");
    const messageShows = screen.queryByTestId("messageDisplay");
    expect(firstNameShows).toBeInTheDocument();
    expect(lastNameShows).toBeInTheDocument();
    expect(emailShows).toBeInTheDocument();
    expect(messageShows).toBeInTheDocument();
  });
});
