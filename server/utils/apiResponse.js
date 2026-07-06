export const sendSuccess = (res, { statusCode = 200, message = "Success", data = null, meta = null }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, { statusCode = 500, message = "Error" }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  return {
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
