// PM2 Ecosystem Config — used on the VPS to manage the backend process
// Usage:
//   pm2 start ecosystem.config.cjs --env production
//   pm2 save
//   pm2 startup   (follow the printed command to auto-start on reboot)

module.exports = {
  apps: [
    {
      name: 'inkdapper-api',
      script: 'server.js',

      // !! UPDATE this path to match your VPS project directory !!
      cwd: '/var/www/inkdapper-dev/backend',

      instances: 1,
      exec_mode: 'fork',

      // Memory limit — restart if Node exceeds 512 MB
      node_args: '--max-old-space-size=512',

      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },

      // Log files
      error_file: '/var/log/pm2/inkdapper-error.log',
      out_file:   '/var/log/pm2/inkdapper-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Restart behaviour
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],

      // Kill process gracefully
      kill_timeout: 5000,
    },
  ],
};
