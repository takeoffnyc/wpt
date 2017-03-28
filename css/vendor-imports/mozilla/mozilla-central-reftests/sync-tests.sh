#!/bin/bash

MOZTREE="$HOME/builds/clean-mozilla-central/"

cd "$(dirname "$0")"

if [ "$(hg par --temp='{node}')" != "$(hg log -rdefault --temp='{node}')" ]
then
    echo "Repository not at tip" 1>&2
    exit 1
fi

if [ "$(hg stat . | wc -l)" != "0" ]
then
    echo "Directory not clean" 1>&2
    exit 1
fi

rsync -avz --delete --filter=". ./sync-tests-filter" "$MOZTREE"/layout/reftests/w3c-css/submitted/ ./
sed -i -e 's/^\(\(fails\|needs-focus\|random\|skip\|asserts\|slow\|require-or\|silentfail\|pref\|test-pref\|ref-pref\|fuzzy\)[^ ]* *\?\)\+//;/^default-preferences /d;s/ \?# \?\(TC: \)\?[bB]ug.*//;s/ # Initial mulet triage:.*//' $(find . -name reftest.list)
sed -i -e 's/-moz-column/column/g;s/-moz-crisp-edges/pixelated/g' $(find . -regex ".*\.\(xht\|xhtml\|html\|css\)")
hg addremove .
hg ci -m"Sync Mozilla tests as of https://hg.mozilla.org/mozilla-central/rev/$(cd "$MOZTREE" && hg par --temp='{node}') ." .
