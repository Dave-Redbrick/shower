from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")
        # Wait for the slides to be rendered by JavaScript
        page.wait_for_selector('.slide')
        # Take a screenshot of the first slide
        slide_one = page.locator('.slide').first
        slide_one.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

if __name__ == "__main__":
    run()