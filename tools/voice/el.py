"""tiny ElevenLabs helper. The key (ELEVENLABS_API_KEY in the repo-root .env or the environment) is read
only when a request is actually made, so rebuilding from cached takes needs no key. Never printed."""
import json, os, re, urllib.request, urllib.parse
API = "https://api.elevenlabs.io"
_KEY = None


def key():
    global _KEY
    if _KEY is None:
        _KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
        env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
        if not _KEY and os.path.exists(env):
            m = re.search(r"^ELEVENLABS_API_KEY=(\S+)", open(env).read(), re.M)
            _KEY = m.group(1).strip().strip('"') if m else ""
        if not _KEY:
            raise SystemExit("ELEVENLABS_API_KEY not set (repo-root .env or environment): needed only to generate new takes/SFX")
    return _KEY


def get(path, **q):
    url = API + path + ("?" + urllib.parse.urlencode({k: v for k, v in q.items() if v is not None}) if q else "")
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"xi-api-key": key()}), timeout=60))


def post(path, body, raw=False, **q):
    url = API + path + ("?" + urllib.parse.urlencode(q) if q else "")
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"xi-api-key": key(), "Content-Type": "application/json"}, method="POST")
    r = urllib.request.urlopen(req, timeout=180)
    return r.read() if raw else json.load(r)


def download(url, path):
    open(path, "wb").write(urllib.request.urlopen(url, timeout=60).read())
