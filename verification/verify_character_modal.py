from playwright.sync_api import sync_playwright

def verify_character_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the game (assuming it's running on localhost:3000)
        page.goto("http://localhost:3000")

        # Wait for the game controls to load
        page.wait_for_selector("div.fixed.top-4.right-4")

        # Click the book icon button (Character Introduction)
        # Using the class name or identifying it by the icon might be tricky,
        # but since we added it, it should be one of the buttons in the top right.
        # Let's try to find it by the BookOpen icon svg or by its position/presence.
        # Since lucide-react renders SVGs, we can look for the SVG with class 'lucide-book-open' if we knew the class,
        # but the code uses <BookOpen className="w-5 h-5" />.
        # We can look for the button that opens the modal.

        # Click the button. It's the second button after VolumeControl.
        # VolumeControl is first.
        # Then Trophy (Achievements).
        # Then BookOpen (Characters) - Wait, in the code I inserted it between Trophy and HowToPlay?
        # Let's check the code order again.
        # VolumeControl
        # Trophy
        # BookOpen (This is the one!)
        # HelpCircle
        # FileText

        # So it's the 3rd element in the flex container (or 2nd button if VolumeControl is complex).
        # Actually VolumeControl is a component.

        # Let's try to click the button by locating the 'book-open' icon inside it.
        # Lucide icons usually have a class like `lucide-book-open`.
        page.locator(".lucide-book-open").click()

        # Wait for the modal to appear
        page.wait_for_selector("text=Character Profile 1 / 8")

        # Take a screenshot of the first character (Riz)
        page.screenshot(path="verification/character_modal_riz.png")
        print("Screenshot of Riz taken.")

        # Click Next
        page.get_by_text("Next").click()

        # Wait for content to change (Rocca)
        page.wait_for_selector("text=Character Profile 2 / 8")

        # Take a screenshot of the second character (Rocca)
        page.screenshot(path="verification/character_modal_rocca.png")
        print("Screenshot of Rocca taken.")

        browser.close()

if __name__ == "__main__":
    verify_character_modal()
