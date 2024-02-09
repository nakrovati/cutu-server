const { FRONTEND_URL } = process.env;

export const Page404 = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Cutu | Page Not Found | 404</title>
        <link rel="stylesheet" href="/public/styles/global.css" />
        <link rel="stylesheet" href="/public/styles/404.css" />
      </head>
      <body>
        <div class="error">
          <h1 class="error__title">Whoops!</h1>
          <p class="error__message">
            The page you are looking for could not be found.
          </p>
          <a href={FRONTEND_URL} class="error__home-link">
            Go to home
          </a>
        </div>
      </body>
    </html>
  );
};
