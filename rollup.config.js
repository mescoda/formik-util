
import pkg from './package.json';

import babel from '@rollup/plugin-babel';

const external = (id) => {
    const isSrc = id.startsWith('.') || id.startsWith('/');
    return !isSrc;
};

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs'
            },
            {
                file: pkg.module,
                format: 'esm'
            }
        ],
        external,
        plugins: [
            babel({
                exclude: '/node_modules/',
                babelHelpers: 'bundled',
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                ie: 11
                            },

                            // disable BrowserslistConfig
                            ignoreBrowserslistConfig: true,

                            // Do not transform modules to CJS using babel
                            modules: false
                        }
                    ],
                    '@babel/preset-react'
                ],
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread'
                ]
            })
        ]
    }
];
