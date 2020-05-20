#!/bin/bash

if [[ $(git status -s) ]]; then
  echo -e "\033[0;31m\nThere were component readme updates made by the build process that are not present in this version of the project.\033[0m"
  git status -s
  echo -e "\033[0;31mPlease built the project locally and make sure all relevent component readme changes are committed.\n\033[0m"
  exit 1
fi
