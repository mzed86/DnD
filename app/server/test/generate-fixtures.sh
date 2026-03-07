#!/bin/bash
# Generate WAV test audio fixtures using macOS say command.
# Output: 16-bit mono PCM WAV at 16kHz (Deepgram-compatible).

FIXTURES_DIR="$(dirname "$0")/fixtures"
mkdir -p "$FIXTURES_DIR"

phrases=(
  "Hello there, what is this place?"
  "Do you know anything about a missing ship?"
  "I would like to buy a drink please"
  "What rumors have you heard lately?"
  "Tell me about the harbormaster"
)

filenames=(
  "hello_tavern"
  "missing_ship"
  "buy_drink"
  "rumors"
  "harbormaster"
)

for i in "${!phrases[@]}"; do
  outfile="$FIXTURES_DIR/${filenames[$i]}.wav"
  echo "Generating: ${filenames[$i]}.wav — \"${phrases[$i]}\""
  say -o "$outfile" --file-format=WAVE --data-format=LEI16@16000 "${phrases[$i]}"
done

echo ""
echo "Generated ${#phrases[@]} test fixtures in $FIXTURES_DIR"
ls -la "$FIXTURES_DIR"/*.wav
