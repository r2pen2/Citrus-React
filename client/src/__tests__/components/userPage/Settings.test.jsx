import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../../../components/userPage/settings/Settings';
import { signInTestUser, signOutTestUser } from "../../../api/testing";
import { BrowserManager } from "../../../api/browserManager";

describe("Settings render tests", () => {

    test('Settings wrapper renders', () => {
        signInTestUser();
        render(<Settings/>);
        const wrapper = screen.getByTestId("user-settings-wrapper");
        expect(wrapper).toBeVisible();
        signOutTestUser();
    });

    test('Paper renders', () => {
        signInTestUser();
        render(<Settings/>);
        const paper = screen.getByTestId("settings-paper");
        expect(paper).toBeVisible();
        signOutTestUser();
    });

    test('Drawer renders', () => {
        signInTestUser();
        render(<Settings/>);
        const drawer = screen.getByTestId("settings-drawer");
        expect(drawer).toBeVisible();
        signOutTestUser();
    });

    test('All drawer items render', () => {
        signInTestUser();
        render(<Settings/>);
        const drawer = screen.getByTestId("settings-drawer");
        const account = screen.getByTestId("drawer-item-Account");
        const appearance = screen.getByTestId("drawer-item-Appearance");
        const connections = screen.getByTestId("drawer-item-Connections");
        const security = screen.getByTestId("drawer-item-Security");
        expect(drawer).toContainElement(account);
        expect(drawer).toContainElement(appearance);
        expect(drawer).toContainElement(connections);
        expect(drawer).toContainElement(security);
        signOutTestUser();
    });
    
});

describe("Settings function tests", () => {

    test('Document title is updated', () => {
        signInTestUser();
        BrowserManager.setTitle("Something else...");
        expect(document.title).not.toEqual("Citrus | Settings");
        render(<Settings/>);
        expect(document.title).toEqual("Citrus | Settings");
        signOutTestUser();
    });

    test('Active element starts as #account', () => {
        signInTestUser();
        render(<Settings/>);
        const account = screen.getByTestId("drawer-item-Account");
        expect(account).toHaveClass("active");
        signOutTestUser();
    });

    test('Active element changes on click', () => {
        signInTestUser();
        render(<Settings/>);
        const account = screen.getByTestId("drawer-item-Account");
        const appearance = screen.getByTestId("drawer-item-Appearance");
        fireEvent.click(account);
        expect(account).toHaveClass("active");
        expect(appearance).not.toHaveClass("active");
        fireEvent.click(appearance);
        expect(appearance).toHaveClass("active");
        expect(account).not.toHaveClass("active");
        signOutTestUser();
    });
});