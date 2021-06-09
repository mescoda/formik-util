
import pkg from './package.json';

import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = (id) => {
    const isSrc = id.startsWith('.') || id.startsWith('/');
    return !isSrc;
};

export default [
    {
        input: 'src/index.ts',
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
            }),
            typescript()
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.types
            }
        ],
        plugins: [
            dts()
        ]
    }
];
