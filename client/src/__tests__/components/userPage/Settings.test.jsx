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

    test('Paper renders', () => {
        render(<Settings user={testUser}/>);
        const paper = screen.getByTestId("settings-paper");
        expect(paper).toBeVisible();
    });

    test('Drawer renders', () => {
        render(<Settings user={testUser}/>);
        const drawer = screen.getByTestId("settings-drawer");
        expect(drawer).toBeVisible();
        const title = screen.getByTestId("settings-drawer-title");
        expect(drawer).toContainElement(title);
    });

    test('All drawer items render', () => {
        render(<Settings user={testUser}/>);
        const drawer = screen.getByTestId("settings-drawer");
        const account = screen.getByTestId("drawer-item-Account");
        const appearance = screen.getByTestId("drawer-item-Appearance");
        const connections = screen.getByTestId("drawer-item-Connections");
        const security = screen.getByTestId("drawer-item-Security");
        expect(drawer).toContainElement(account);
        expect(drawer).toContainElement(appearance);
        expect(drawer).toContainElement(connections);
        expect(drawer).toContainElement(security);
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