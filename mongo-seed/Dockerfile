FROM mongo:4.4.17-rc2

WORKDIR /
COPY airports.json /airports.json
COPY routes.json /routes.json
COPY import.sh /import.sh
RUN chmod 777 import.sh
CMD ./import.sh