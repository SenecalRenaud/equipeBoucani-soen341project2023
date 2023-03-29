from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


def test_multiple_browsers():
    # Chrome

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(chrome_options=options)

    driver.get("localhost:3000")

    title = driver.title
    print(title)
    assert title == "React App", "Title is incorrect"

    driver.implicitly_wait(0.5)

    basicText = driver.find_elements(By.CLASS_NAME, 'gradient__text')
    if len(basicText) == 0:
        assert False, "basic text missing home on page"

    navLinks = driver.find_elements(By.CLASS_NAME, 'sc-gswNZR')
    if len(navLinks) == 0:
        assert False, "missing navbar elements on main page"

    driver.quit()

    # Firefox
    # driver = webdriver.Firefox()
    #
    # driver.get("http://127.0.0.1:3000/")
    #
    # title = driver.title
    # assert title == "React App", "Title is incorrect"
    #
    # driver.implicitly_wait(0.5)
    #
    # driver.quit()

    # Edge
    # driver = webdriver.Edge()
    #
    # driver.get("http://127.0.0.1:3000/")
    #
    # title = driver.title
    # assert title == "React App", "Title is incorrect"
    #
    # driver.implicitly_wait(0.5)
    #
    # basicText = driver.find_elements(By.CLASS_NAME, 'gradient__text')
    # if len(basicText) == 0:
    #     assert False, "basic text missing home on page"
    #
    # navLinks = driver.find_elements(By.CLASS_NAME, 'sc-gswNZR')
    # if len(navLinks) == 0:
    #     assert False, "missing navbar elements on main page"
    #
    # driver.quit()

    # Safari
    # driver = webdriver.Safari()
    #
    # driver.get("http://127.0.0.1:3000/")
    #
    # title = driver.title
    # assert title == "React App", "Title is incorrect"
    #
    # driver.implicitly_wait(0.5)
    #
    # driver.quit()

    # text_box = driver.find_element(by=By.NAME, value="my-text")
    # submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
    #
    # text_box.send_keys("Selenium")
    # submit_button.click()
    #
    # message = driver.find_element(by=By.ID, value="message")
    # value = message.text
    # assert value == "Received!"


test_multiple_browsers()
