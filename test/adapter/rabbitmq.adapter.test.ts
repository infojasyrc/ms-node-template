import RabbitMQAdapter from '../../src/adapters/rabbitmq.adapter'
import { TodoInterface } from '../../src/entities/interfaces/data/todo.interface'
import amqp from 'amqplib'

jest.mock('amqplib')

describe('RabbitMQ adapter', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const connection = {
    username: 'root',
    password: 'root',
    host: 'localhost',
    port: 123,
  }

  test('RabbitMQ get instance:instance not exist and throw an error', () => {
    expect(() => {
      RabbitMQAdapter.getInstance()
    }).toThrowError(/no data for connection/i)
  })

  test('RabbitMQ initial instance by getInstance', async () => {
    amqp.connect = jest.fn().mockResolvedValue(123)

    const queue = await RabbitMQAdapter.getInstance(connection)
    expect(queue.constructor).toBeTruthy()
  })

  test('RabbitMQ get instance: same instance', async () => {
    amqp.connect = jest.fn().mockResolvedValue(123)

    const queue = await RabbitMQAdapter.getInstance(connection)

    const qInstance = await RabbitMQAdapter.getInstance()
    expect(queue.constructor).toBeTruthy()
    expect(qInstance).toBe(queue)
  })

  test('RabbitMQ new instance', async () => {
    amqp.connect = jest.fn().mockResolvedValue(123)

    const queue = await new RabbitMQAdapter(connection)
    expect(queue.constructor).toBeTruthy()
  })

  test('RabbitMQ connect error', async () => {
    const expectedError = new Error('something ocurred')
    amqp.connect = jest.fn().mockReturnValue(Promise.reject(expectedError))

    try {
      await RabbitMQAdapter.getInstance(connection)
    } catch (error) {
      expect(error).toBe(expectedError)
    }
  })

  test('RabbitMQ instance exist', async () => {
    amqp.connect = jest.fn().mockResolvedValue(123)

    await RabbitMQAdapter.getInstance(connection)
    const queue = await RabbitMQAdapter.getInstance()
    expect(queue.constructor).toBeTruthy()
  })
})
