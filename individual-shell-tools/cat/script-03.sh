#!/bin/bash

set -euo pipefail

# TODO: Write a command to output the contents of the file `helper-3.txt` inside the helper-files directory to the terminal.
# This time, we also want to see the line numbers in the output.
#
# The output of this command should be something like:
# 1 It looked delicious.
# 2 I was tempted to take a bite of it.
# 3 But this seemed like a bad idea...
cat -n ../helper-files/helper-3.txt

#!/bin/bash

set -euo pipefail

# TODO: Write a command to output the contents of all of the files inside the helper-files directory to the terminal.
# Make sure you are only calling `cat` once.
#
# The output of this command should be:
# Once upon a time...
# There was a house made of gingerbread.
# It looked delicious.
# I was tempted to take a bite of it.
# But this seemed like a bad idea...
cat ../helper-files/*.txt