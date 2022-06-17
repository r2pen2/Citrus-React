import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataPage from '../../../components/dataPage/DataPage';

const testData = {
    pageTitle: "Test",
    sections: [
        {
            sectionTitle: "A section",
            items: [
                {
                    title: "This is an item",
                    subtitle: "This is the subtitle for this item",
                    href: "https://youtu.be/dQw4w9WgXcQ" 
                }
            ]
        },
        {
            sectionTitle: "Another section",
            items: [
                {
                    title: "This is another item",
                    subtitle: "This is the subtitle for that other item",
                    href: "https://youtu.be/dQw4w9WgXcQ" 
                }
            ]
        }
    ]
};

describe("DataPage render tests", () => {

    test("Datapage renders page title", () => {
        render(<DataPage data={testData} />)
        const pageWrapper = screen.getByTestId(testData.pageTitle);
        expect(pageWrapper).toBeVisible();
        const pageTitle = screen.queryByTestId("data-page-title");
        expect(pageWrapper).toContainElement(pageTitle);
        expect(pageTitle).toContainHTML(testData.pageTitle);
    });

    test("Datapage renders all section titles", () => {
        render(<DataPage data={testData} />)
        for (const s of testData.sections) {
            const sectionWrapper = screen.getByTestId("data-section-" + s.sectionTitle);
            expect(sectionWrapper).toBeVisible();
            const sectionTitleElement = screen.getByTestId("data-section-title-" + s.sectionTitle);
            expect(sectionWrapper).toContainElement(sectionTitleElement);
            expect(sectionTitleElement).toContainHTML(s.sectionTitle);
        }
    });

    test("Datapage renders all items in each section", () => {
        render(<DataPage data={testData} />)
        for (const s of testData.sections) {
            for (const i of s.items) {
                const itemWrapper = screen.getByTestId("section-item-" + i.title);
                expect(itemWrapper).toBeVisible();
                const itemSubtitle = screen.getByTestId("section-item-subtitle-" + i.title);
                expect(itemWrapper).toContainElement(itemSubtitle);
            }
        }
    });

    test("Datapage item hrefs are all correct", () => {
        render(<DataPage data={testData} />)
        for (const s of testData.sections) {
            for (const i of s.items) {
                const itemAnchors = screen.getAllByTestId("section-item-anchor-" + i.title);
                for (const a of itemAnchors) {
                    expect(a).toHaveAttribute("href", i.href);
                    expect(a).toContainHTML(i.title);
                }
            }
        }
    });
});