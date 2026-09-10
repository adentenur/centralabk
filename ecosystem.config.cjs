module.exports = {
  apps: [
    {
      name: 'centralabk',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0'
      },
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      time: true
    }
  ]
}
