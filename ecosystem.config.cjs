module.exports = {
  apps: [
    {
      name: 'gudang-inventaris',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0',
        DATABASE_URL='postgresql://postgres.ggfkzojuigruabfvinet:cntrlABK2027@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
      },
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      time: true
    }
  ]
}
