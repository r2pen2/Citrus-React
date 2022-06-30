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
});

describe("Topbar function tests", () => {
});