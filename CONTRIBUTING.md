[Pull Requests](https://github.com/zyf722/typst-tabler-icons/pulls) are welcome!

It is strongly recommended to follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification when writing commit messages and creating pull requests.

### Github Actions Workflow
This package uses a daily run [Github Actions workflow](https://github.com/zyf722/typst-tabler-icons/blob/main/.github/workflows/build.yml) to keep the library up-to-date with the latest version of Tabler Icons, which internally runs [`scripts/generate.mjs`](https://github.com/zyf722/typst-tabler-icons/blob/main/scripts/generate.mjs) to generate Typst source code of the library and gallery.