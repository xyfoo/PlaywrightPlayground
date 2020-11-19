const { assert } = require("console");
const { chromium, devices } = require("playwright");


// What the code will do
// 1 - Launch a browser instance
// 2 - For each device
//      2.1 - Create a browser context using the device preset profile
//      2.2 - Start video recording
//      2.3 - Go to google, type 'USB C' into query box, and press enter
//      2.4 - Wait for network to idle
//      2.5 - Take a screenshot
//      2.6 - Assert if the result page's search box has the 'USB C' text
//      2.7 - Close the browser context
// 3 - Close browser instance

(async () => {
    var browser = await chromium.launch();

    let testDeviceNames = ["Nexus 5X landscape", "iPad Pro 11", "Galaxy Note II"];
    let devicePromises = testDeviceNames.map(async (deviceName) => {
        let dContext = await browser.newContext({
            ...devices[deviceName],
            recordVideo: { dir: `videos\\${deviceName}` }
        });
        let page = await dContext.newPage();
        await page.goto("https://www.google.com");
        await page.fill("input[type=search]", "USB C");
        await page.press("input[type=search]", "Enter")
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: `screenshots\\${deviceName}.png` });
        let actualText = await page.getAttribute("input[type=search]", "value");
        assert("USB C" === actualText);
        await dContext.close();
    })

    await Promise.all(devicePromises);
    browser.close();
})();
