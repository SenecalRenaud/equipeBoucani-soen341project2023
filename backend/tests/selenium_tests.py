import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait


def test_multiple_browsers():
    # Chrome

    options = Options()
    # options.add_argument('--headless')
    # options.add_argument('--no-sandbox')
    # options.add_argument('--disable-dev-shm-usage')
    options.add_experimental_option("detach", True)

    driver = webdriver.Chrome(options=options)

    driver.get("http://localhost:3000")

    title = driver.title
    assert title == "Boucani Center", "Title is incorrect"

    basicText = driver.find_elements(By.CLASS_NAME, 'gradient__text')
    if len(basicText) == 0:
        assert False, "basic text missing home on page"

    navLinks = driver.find_elements(By.CLASS_NAME, 'sc-gswNZR')  # checking for navbar
    if len(navLinks) == 0:
        assert False, "missing navbar elements on main page"

    signIn = driver.find_elements(By.CLASS_NAME, 'whitespace')
    signIn[1].click()  # navigates to sign in page

    emailInput = driver.find_element(By.ID, 'email-input')  # enters user email
    emailInput.send_keys("equipeboucani@gmail.com")
    passwordInput = driver.find_element(By.ID, 'password-input')  # enters user password
    passwordInput.send_keys("boucani12")

    driver.find_element(By.CLASS_NAME, 'sign-in-button').click()  # clicks login
    WebDriverWait(driver, 10).until(lambda localDriver: localDriver.current_url == "http://localhost:3000")

    print(driver.current_url)  # redirected to home page after login

    driver.quit()


test_multiple_browsers()
