import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../../../components/userPage/settings/Settings';

const testUser = { id: 1, firstName: "John", lastName: "Doe" }

describe("Settings render tests", () => {

    test('Settings wrapper renders', () => {
        render(<Settings user={testUser}/>);
        const wrapper = screen.getByTestId("user-settings-wrapper");
        expect(wrapper).toBeVisible();
    });
});

describe("Settings function tests", () => {

    test('Document title is updated', () => {
        document.title = "Something else...";
        expect(document.title).not.toEqual("Citrus | Settings");
        render(<Settings user={testUser}/>);
        expect(document.title).toEqual("Citrus | Settings");
    });
});