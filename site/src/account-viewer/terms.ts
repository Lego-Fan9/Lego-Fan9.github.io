export function populateTermsModal() {
    const modalBody = document.querySelector(".modal-body");
    if (!modalBody) return;

    modalBody.innerHTML = `
    <p>Last Updated: 10/25/2025</p>
    <p>
      <b>1. Use of the Site</b><br>
      SWGoH Account Viewer is a free, fan-created tool for viewing data from Star Wars: Galaxy of Heroes (SWGoH). 
      This site is provided "as-is" with no guarantees or warranties.
    </p>
    <p>
      <b>2. Fair Use and Third-Party Assets</b><br>
      The Site may use images, names, fonts, and other assets that are the property of third parties.
      These materials are used under <strong>fair use</strong> for non-commercial, transformative purposes 
      such as parody, commentary, or fan art.
      If you are a rights holder and believe your content has been used improperly, please contact us and we 
      will review and take appropriate action.
    </p>
    <p>
      <b>3. Data Collection & Privacy</b><br>
      This site may log your requests for usage analytics and debugging. In the event of a server error, this 
      may include your IP address. These logs are stored in Render and only viewed by approved administrators 
      of the server.
      <strong>GitHub Pages</strong> (our hosting provider) may log standard web server information (IP address, 
      browser, etc.) in accordance with their terms. This data cannot be seen or deleted by Lego-Fan9.
      <strong>Render</strong> is used to get SWGoH data and they may log minimal usage data in accordance 
      with their terms and cannot be deleted by Lego-Fan9.
      We do not use cookies, analytics scripts, or trackers for marketing purposes; however, we may use them 
      to determine if/when we need to upgrade or downgrade our service.
      <b>No</b> data is sold.
      Note: The "Recent Searches" is stored client side and our servers never see it.
    </p>
    <p>
      <b>4. Changes to the Terms</b><br>
      These terms may be updated from time to time. We’ll update the date at the top of this document when 
      changes occur. Continued use of the Site after changes constitutes your acceptance of the new terms.
    </p>
    <p>
      <b>5. Contact</b><br>
      For questions, feedback, or copyright concerns, please reach out via email to 
      LegoFan9-Bot@hotmail.com
    </p>
    <p>
      Check out the source code on 
      <a href="https://github.com/Lego-Fan9/Lego-Fan9.github.io" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>.
    </p>
  `;
}
