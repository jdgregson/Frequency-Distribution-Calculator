# This script deploys the app to GitHub Pages by committing all files from
# /build to the gh-pages branch and pushing them.

git checkout --orphan gh-pages
git --work-tree build add --all
git --work-tree build commit -m 'gh-pages'
git push origin HEAD:gh-pages --force
git checkout -f master