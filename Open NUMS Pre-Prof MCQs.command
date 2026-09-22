#!/bin/zsh
cd "${0:A:h}" || exit 1
python3 launch.py
status=$?
if (( status != 0 )); then
  echo "The launcher stopped with an error. Press Return to close this window."
  read
fi
