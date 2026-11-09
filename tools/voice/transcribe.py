import json, sys, whisper
files = json.load(open(sys.argv[1])); out = {}
m = whisper.load_model(sys.argv[3] if len(sys.argv) > 3 else "small")
for f in files: out[f] = m.transcribe(f, language="en", fp16=False, word_timestamps=True)
json.dump({f: {"text": r["text"].strip(), "words": [dict(w=w["word"], s=w["start"], e=w["end"]) for s in r["segments"] for w in s["words"]]} for f, r in out.items()}, open(sys.argv[2], "w"), indent=1)
