import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Topbar from '../../../components/topbar/Topbar';

describe("Topbar render tests", () => {

    test('Renders no-user topbar when no user is passed in', () => {
        render(<Topbar user={null} />);
        const topbarWrapper = screen.queryByTestId("topbar-wrapper");
        const noUserTopbar = screen.queryByTestId("no-user-topbar");
        expect(topbarWrapper).toContainElement(noUserTopbar);
        const userTopbar = screen.queryByTestId("user-topbar");
        expect(topbarWrapper).not.toContainElement(userTopbar);
    });

    test('Renders user topbar when user is passed in', () => {
        const testUser = { firstName: "John", lastName: "Doe" }
        render(<Topbar user={testUser} />);
        const topbarWrapper = screen.queryByTestId("topbar-wrapper");
        const noUserTopbar = screen.queryByTestId("no-user-topbar");
        expect(topbarWrapper).not.toContainElement(noUserTopbar);
        const userTopbar = screen.queryByTestId("user-topbar");
        expect(topbarWrapper).toContainElement(userTopbar);
    });
});

describe("Topbar function tests", () => {

    test('Logout button clears user from localStorage', () => {
        const testUser = { firstName: "John", lastName: "Doe" }
        localStorage.setItem('user', JSON.stringify(testUser));
        render(<Topbar user={testUser} />);
        const logoutButton = screen.queryByTestId("topbar-logout-button");
        fireEvent.click(logoutButton);
        const userExistsInLS = localStorage.getItem('user') ? true : false;
        expect(userExistsInLS).toBe(false);
    });
});