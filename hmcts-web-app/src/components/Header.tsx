const Header = () => {
    return (
        <header className="govuk-header" data-module="govuk-header">
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__logo">
                    <a href="#" className="govuk-header__link govuk-header__link--homepage">
                        <svg
                            focusable="false"
                            role="img"
                            className="govuk-header__logotype"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 148 30"
                            height="30"
                            width="148"
                            aria-label="GOV.UK">
                            <title>GOV.UK</title>
                        </svg>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header;