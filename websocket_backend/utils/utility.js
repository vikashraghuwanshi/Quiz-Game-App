function getTokenFromRequest(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get("token");
  }
  
module.exports = { getTokenFromRequest };
  