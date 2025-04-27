#!/usr/bin/env bash

awk -F'=' '
  /^[[:space:]]*($|#)/ { next }

  FILENAME == ARGV[1] {
    server[$1] = $2; next
  }
  FILENAME == ARGV[2] {
    client[$1] = $2; next
  }
  FILENAME == ARGV[3] {
    original[$1] = $2; next
  }

  END {
    for (k in server)   keys[k] = 1
    for (k in client)  keys[k] = 1
    for (k in original)  keys[k] = 1

    for (k in keys) {
      if (k in original) {
        print k "=" original[k]
      }
      else if ((k in server) && (k in client)) {
        print k "_SERVER=" server[k]
        print k "_CLIENT=" client[k]
      }
      else if (k in server) {
        print k "=" server[k]
      }
      else {
        print k "=" client[k]
      }
    }
  }
' server/.env client/.env .env > .env.merged \
  && mv .env.merged .env

echo "Merge .env successfully"
