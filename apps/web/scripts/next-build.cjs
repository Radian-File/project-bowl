#!/usr/bin/env node

process.env.NODE_ENV = "production";
process.argv = [process.argv[0], require.resolve("next/dist/bin/next"), "build"];
require("next/dist/bin/next");
