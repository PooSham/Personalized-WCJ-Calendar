import $ from 'jquery';
import ColorHash from 'color-hash';
import pageHandler from './page-handler';
const colorHash = new ColorHash({ saturation: 0.3 });

function handleClientLoad() {
  gapi.load("client", async () => {
    gapi.client.setApiKey("AIzaSyCMeXBPWfEvrxH4-U8y3VpWhDPZnwYqRMc");
    await gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
      .catch((err) => { console.error("Error loading GAPI client for API", err); });
    // Load from Google calendar
    const response = await gapi.client.calendar.events.list({
      "calendarId": "wcj.se_57n2cj034c49cirl0rl20t3io4@group.calendar.google.com",
      "alwaysIncludeEmail": false,
      "timeMin": new Date().toISOString() // "2020-09-10T10:43:14.507Z"
    });

    const events = response.result.items.map(x => ({
      ...x,
      bgColor: colorHash.hex(x.summary),
      textColor: colorHash.hsl(x.summary)[2] > 0.5 ? "black" : "white"
    }));

    pageHandler(events);
  });
}

$.ajax({
  url: 'https://apis.google.com/js/api.js',
  dataType: 'script',
  success: () => {
    $(document).on('readystatechange', function () {
      if (this.readyState === 'complete') handleClientLoad();
    });
  },
  async: true
});

