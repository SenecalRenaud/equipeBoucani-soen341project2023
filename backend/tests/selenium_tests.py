import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
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

    # LOGIN TEST + MAIN PAGE
    signIn = driver.find_elements(By.CLASS_NAME, 'whitespace')
    signIn[3].click()  # navigates to sign in page

    emailInput = driver.find_element(By.ID, 'email-input')  # enters user email
    emailInput.send_keys("equipeboucani@gmail.com")
    passwordInput = driver.find_element(By.ID, 'password-input')  # enters user password
    passwordInput.send_keys("boucani12")

    driver.find_element(By.CLASS_NAME, 'sign-in-button').click()  # clicks login
    time.sleep(5)

    if driver.find_element(By.ID, 'navbarLoggedInName').text != "Equipe Boucani":  # checking that we have successfully logged in
        assert False
    print(driver.find_element(By.ID, 'navbarLoggedInName').text)
    print(driver.current_url)  # redirected to home page after login

    # POST A JOB TEST
    driver.get("http://localhost:3000/jobposting")  # navigate to posting page
    driver.find_element(By.ID, "Full-Time").click()
    driver.find_element(By.ID, "job-title-input").send_keys("Job Title")
    driver.find_element(By.ID, "location-input").send_keys("Location")
    salarySlider = driver.find_element(By.ID, "salary-input")
    for i in range(30):
        salarySlider.send_keys(Keys.ARROW_RIGHT)
    driver.find_element(By.ID, "IT").click()
    driver.find_element(By.ID, "Marketing").click()
    driver.find_element(By.ID, "job-description-input").send_keys("TestingTheSubmitFeature")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(5)
    driver.find_element(By.CLASS_NAME, "apply-button").click()  # filled form is submitted

    driver.get("http://localhost:3000/viewjobposts")
    description = driver.find_elements(By.XPATH, "//p[@class='sc-dIfARi cHVhso']")
    print(description)

    driver.quit()


test_multiple_browsers()
