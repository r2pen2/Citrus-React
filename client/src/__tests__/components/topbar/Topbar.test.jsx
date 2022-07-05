import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Topbar from '../../../components/topbar/Topbar';
import { signInTestUser, signOutTestUser } from "../../../api/testing"


describe("Topbar render tests", () => {

    test('Renders no-user topbar when no user is passed in', () => {
        signOutTestUser();
        render(<Topbar/>);
        const topbarWrapper = screen.queryByTestId("topbar-wrapper");
        const noUserTopbar = screen.queryByTestId("no-user-topbar");
        expect(topbarWrapper).toContainElement(noUserTopbar);
        const userTopbar = screen.queryByTestId("user-topbar");
        expect(topbarWrapper).not.toContainElement(userTopbar);
    });

    test('Renders user topbar when user is passed in', () => {    
        signInTestUser();
        render(<Topbar/>);
        const topbarWrapper = screen.queryByTestId("topbar-wrapper");
        const noUserTopbar = screen.queryByTestId("no-user-topbar");
        expect(topbarWrapper).not.toContainElement(noUserTopbar);
        const userTopbar = screen.queryByTestId("user-topbar");
        expect(topbarWrapper).toContainElement(userTopbar);
        signOutTestUser();
    });
});

describe("Topbar function tests", () => {
});