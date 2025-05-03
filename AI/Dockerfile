# Use the official Ollama base image
FROM ollama/ollama:latest

# --- Build-time Model Preloading ---

# Copy the Modelfile into the imagea
COPY Modelfile /Modelfile

# Run the 'ollama create' command during the build process.
# We need to start the server in the background first,
# wait for it to be ready, create the model, and then stop the server.
RUN \
    ollama serve & \
    sleep 5 && \
    ollama create currmodel-preloaded -f /Modelfile && \
    pkill ollama

# --- Runtime Configuration ---

# Expose the default Ollama port
EXPOSE 11434

# Set the default entrypoint to the ollama command
ENTRYPOINT ["ollama"]

# Set the default command to run the Ollama server when the container starts
CMD ["serve"]

# Optional: Clean up the copied Modelfile if desired
# RUN rm /Modelfile
